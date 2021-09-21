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
let router = express.Router();


let loginErrors = []
let patientsInfo;

router.get("/login", async (req, res) =>
{
    if (!req.session.isLoggedIn)
    {
        let data = {
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
                    res.redirect("/staff/profil");
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
       let person = req.session.user[0];
       let signedIn = true;
       let data = {
            title: "Vårdpersonalens profil | Digi vaccin",
            signedIn,
            person,
            patients: [],
            isStaff: true,
       }
       res.render("pages/staff/profil", data);
   } else
   {
       res.redirect("/");
   }
});

router.get("/search=:searchTerm", async (req, res) =>
{
    let search = req.params.searchTerm;
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        let people = await patientInfo.getPatientBySearch(search);
        let data = {
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
        let patient = await patientInfo.getPatientByID(id);
        if (patient.length > 0)
        {
            let vaccines = await patientInfo.getVaccinByPatient(id);
            let data = {
                title: "Vårdpersonalens sök | Digi vaccin",
                signedIn: true,
                person: req.session.user[0],
                patient: patient[0],
                vaccines,
                isStaff: true,
            }
            res.render("pages/staff/patient", data);
        } else
        {
            res.redirect("/staff/profil");
        }
    } else
    {
        res.redirect("/staff/login");
    }
});

router.get("/edit=:id", async (req, res) =>
{
    let id = req.params.id;
    if (req.session.isLoggedIn && req.session.isStaff)
    {
        let patient = await patientInfo.getPatientByID(id);
        if (patient.length > 0)
        {
            let data = {
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
        let patient = await patientInfo.getPatientByID(id);

        if (patient.length > 0)
        {
            let vaccines = await patientInfo.getAllvaccines();
            let data = {
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
module.exports = router;