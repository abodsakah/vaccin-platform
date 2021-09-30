/**
* 
*   The route for the staff login and info
* 
*/
"use strict";

let express = require("express");
let auth = require("../src/auth");
let patientInfo = require("../src/getInfo");
let patientSetter = require("../src/setInfo");
const cron = require("node-cron");
let bcrypt = require("bcrypt");
let ejs = require("ejs");
let router = express.Router();
let nodemailer = require("nodemailer");
const dotenv = require('dotenv').config({ path: './config/.env' });


let loginErrors = []
let errors = [];
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: dotenv.parsed.MAIL,
        pass: dotenv.parsed.MAIL_PASSWORD
    }
});

router.get("/login", async (req, res) =>
{
    if (!req.session.isLoggedIn)
    {
        req.session.prevPage = req.originalUrl;
        let cookies = req.session.acceptedCookies;
        let data = {
            cookies,
            title: "Logga in till vårdpersonalens portal | Digi vaccin",
            errors: loginErrors,
            
        }
        res.render("pages/staff/login", data);
    } else
    {
        res.redirect("/staff/profil");
    }
});

router.post("/login", async (req, res) =>
{
    let username = req.body.username;
    let password = req.body.password;
    if (!req.session.isLoggedIn)
    {
        let user = await auth.getStaff(username);
        if (user.length > 0)
        {
            bcrypt.compare(password, user[0].password, (err, result) =>
            {
                if (err) console.log(err);
            
                if (result)
                {
                    loginErrors = [];
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    req.session.isStaff = true;
                    if (user[0].title == "admin")
                    {
                        req.session.isAdmin = true;
                        res.redirect("/admin/dashboard");
                    }else if(user[0].title == "doktor")
                    {
                        req.session.isAdmin = false;
                        res.redirect("/staff/profil");
                    }
                    
                } else
                {
                    loginErrors = [];
                    loginErrors.push("Inloggnings informationen som du angav är fel!");
                    res.redirect("/staff/login");
                }
            });
        } else
        {
            loginErrors = [];
            loginErrors.push("Inloggnings informationen som du angav är fel!");
            res.redirect("/staff/login");
        }
    }else
    {
        res.redirect("/staff/profil");
    }
});

router.get("/profil", async (req, res) =>
{
   if(req.session.isLoggedIn && req.session.isStaff)
   {
       req.session.prevPage = req.originalUrl;
       let d = new Date();
       let month = d.getMonth() + 1;
       if(month < 10)
       {
           month = "0" + month;
       }
       let date = d.getFullYear() + "-" + month + "-" + d.getDate();
       let bookings = await patientInfo.getBookingForStaff(req.session.user[0].id);
       let person = req.session.user[0];
       let signedIn = true;
       let cookies = req.session.acceptedCookies;
       let data = {
            cookies,
            title: "Vårdpersonalens profil | Digi vaccin",
            signedIn,
            person,
            patients: [],
            isStaff: true,
            bookings,
            date
       }
       res.render("pages/staff/profil", data);
   } else
   {
       res.redirect("/staff/login");
   }
});

router.get("/search=:searchTerm", async (req, res) =>
{
    let search = req.params.searchTerm;
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        req.session.prevPage = req.originalUrl;
        let people = await patientInfo.getPatientBySearch(search);
        let cookies = req.session.acceptedCookies;
        let data = {
            cookies,
            title: "Vårdpersonalens sök | Digi vaccin",
            signedIn: true,
            person: req.session.user[0],
            patients: people,
            isStaff: true,
        }
        res.render("pages/staff/search", data);
    } else
    {
        res.redirect("/staff/login");
    }
});

router.get("/patient=:id", async (req, res) =>
{
    let id = req.params.id;
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        req.session.prevPage = req.originalUrl;
        let patient = await patientInfo.getPatientByID(id);
        if (patient.length > 0)
        {
            let vaccines = await patientInfo.getVaccinByPatient(id);
            let cookies = req.session.acceptedCookies;
            let data = {
                cookies,
                title: "Vårdpersonalens sök | Digi vaccin",
                signedIn: true,
                person: req.session.user[0],
                patient: patient[0],
                vaccines,
                isStaff: true,
                errors
            }
            res.render("pages/staff/patient", data);
            errors = [];
        } else
        {
            res.redirect("/staff/profil");
            errors = [];
        }
    } else
    {
        res.redirect("/staff/login");
    }
});

router.post("/patient=:id", async (req, res) =>
{
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        let patient_id = req.params.id;
        let staff_id = req.session.user[0].id;
        let date = req.body.date;
        let time = req.body.time;
        if(date !== "" && time !== ""){
            patientSetter.bookTime(patient_id, staff_id, date, time);
            errors = [];
            res.redirect(`/staff/patient=${patient_id}`);
        } else
        {
            errors = [];
            errors.push("Du måste välja en tid och en datum för att boka!");
            res.redirect(`/staff/patient=${patient_id}`);
        }
    }else
    {
        res.redirect("/staff/login");
    }
});


router.get("/edit=:id", async (req, res) =>
{
    let id = req.params.id;
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        req.session.prevPage = req.originalUrl;
        let patient = await patientInfo.getPatientByID(id);
        if (patient.length > 0)
        {
            let cookies = req.session.acceptedCookies;
            let data = {
                cookies,
                title: "Vårdpersonalens redigera patient | Digi vaccin",
                signedIn: true,
                person: req.session.user[0],
                patient: patient[0],
                isStaff: true,
            }
            res.render("pages/staff/edit", data);
        }
    } else
    {
        res.redirect("/staff/login");
    }
});

router.post("/edit=:id", async (req, res) =>
{
    let id = req.params.id;
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        patientSetter.updatePatientById(id, req.body.first_name, req.body.last_name, req.body.mail, req.body.mobile, req.body.adress);
        res.redirect(`/staff/patient=${id}`);
    } else
    {
        res.redirect("/staff/login");
    }
});

router.get("/add-vaccin=:id", async (req, res) =>
{

    let id = req.params.id;
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        req.session.prevPage = req.originalUrl;
        let patient = await patientInfo.getPatientByID(id);

        if (patient.length > 0)
        {
            let vaccines = await patientInfo.getAllvaccines();
            let cookies = req.session.acceptedCookies;
            let data = {
                cookies,
                title: "Vårdpersonalens Lägg till vaccin dose | Digi vaccin",
                signedIn: true,
                person: req.session.user[0],
                isStaff: true,
                patient: patient[0],
                vaccines,                
            }
            res.render("pages/staff/add-vaccin", data);
        }
    } else {
        res.redirect("/staff/login");
    }
});

router.post("/add-vaccin=:id", async (req, res) =>
{
    let id = req.params.id;
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        patientSetter.addDose(id, req.session.user[0].id, req.body.vaccin, req.body.date);
        res.redirect(`/staff/patient=${id}`);
    } else
    {
        res.redirect("/staff/login");
    }
});

router.get("/add-patient", (req, res) =>
{
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        req.session.prevPage = req.originalUrl;
        let cookies = req.session.acceptedCookies;
        let data = {
            cookies,
            title: "Vårdpersonalens redigera patient | Digi vaccin",
            signedIn: true,
            person: req.session.user[0],
            isStaff: true,
        }
        res.render("pages/staff/add-patient", data);
    } else {
        res.redirect("/staff/login");
    }
});
router.post("/add-patient", async (req, res) =>
{
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        let password = Math.random().toString(36).slice(-10);
        let hashedPassword = await bcrypt.hash(password, 10);
        let checkPatient = await auth.getPat(req.body.personnummer);
        if (checkPatient.length > 0)
        {
            errors.push("Detta personnummer finns redan!");
        } else
        {
            let addPatientStat = patientSetter.addUser(req.body.first_name, req.body.last_name, req.body.mail, req.body.phone, req.body.adress, req.body.personnummer, hashedPassword);
            const data = await ejs.renderFile(process.cwd() + "/views/mail/new-user.ejs", { password: password, personnummer: req.body.personnummer });
            let info = await transporter.sendMail({
                from: '"Digi vaccin" <abodsakka2001@gmail.com>',
                to: req.body.mail,
                subject: "Digi vaccin - Ny patient information",
                text: `Hej ${req.body.first_name}! Har fått nya inloggning på Digi vaccin. ditt nya lösenord är ${password}.`,
                html: data

            });
            console.log("Message sent: %s", info);
        }
        res.redirect("/staff/profil");
    } else
    {
        res.redirect("/staff/login");
    }
});

router.get("/edit-booking=:id", async (req, res) =>
{
    if(req.session.isLoggedIn && req.session.isStaff)
    {
        req.session.prevPage = req.originalUrl;
        let id = req.params.id;
        let bookingInfo = await patientInfo.getBookingById(id);
        let cookies = req.session.acceptedCookies;
        let data = {
            cookies,
            title: "Vårdpersonalens redigera bokning | Digi vaccin",
            signedIn: true,
            person: req.session.user[0],
            isStaff: true,
            bookingInfo
        }
        res.render("pages/staff/edit-booking", data);
    } else
    {
        res.redirect("/staff/login")
    }
});

router.post("/edit-booking=:id", async (req, res) =>
{
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        let id = req.params.id;
        let date = req.body.date;
        let time = req.body.time;
        patientSetter.updateBooking(id, date, time);

        res.redirect(`/staff/profil`);
    } else
    {
        res.redirect("/staff/login");
    }
});

module.exports = router;