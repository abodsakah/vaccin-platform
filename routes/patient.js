/**
* 
*   The route for the patient login and info
* 
*/
"use strict";

let express = require("express");
let auth = require("../src/auth");
let patientSetter = require("../src/setInfo");
let vaccinInfo = require("../src/getInfo");
let bcrypt = require("bcrypt");
const { error } = require("npmlog");
let nodemailer = require("nodemailer");
const dotenv = require('dotenv').config({ path: './config/.env' });
const ejs = require("ejs");
let router = express.Router();

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: dotenv.parsed.MAIL,
        pass: dotenv.parsed.MAIL_PASSWORD
    }
});

let loginErrors = []
let errors = [];

router.get("/login", (req, res) =>
{
    if(!req.session.isLoggedIn){
        let data = {
            title: "Logga in till din patient profil | Digi vaccin",
            errors: loginErrors
        }
        res.render("pages/pat/login", data);
    } else
    {
        res.redirect("/patient/profil");
    }
});
router.post("/login", async (req, res) =>
{
    let user = await auth.getPat(req.body.personnummer);
    if (user.length > 0)
    {
        let password = req.body.password;
        bcrypt.compare(password, user[0].password, (err, result) =>
        {
            if (err) console.log(err);
            
            if (result)
            {
                loginErrors = [];
                req.session.user = user;
                req.session.isLoggedIn = true;
                res.redirect("/patient/profil");
            } else
            {
                loginErrors = [];
                loginErrors.push("Inloggnings informationen som du angav är fel!");
                res.redirect("/patient/login");
            }
        });
    }else
    {
        loginErrors.push("Inloggnings informationen som du angav är fel!");
        res.redirect("/patient/login");
    }
});

router.get("/profil", async (req, res) =>
{
    if (req.session.isLoggedIn)
    {
        let person = req.session.user[0];
        let vaccins = await vaccinInfo.getVaccinByPatient(person.id);
        let signedIn = true;
        let data = {
            title: "Din patient profil | Digi vaccin",
            signedIn,
            person: person,
            vaccins,
            person,
            isStaff : false
        }
        res.render("pages/pat/profile", data);
    } else
    {
        res.redirect("/patient/login");
    }
});

router.get("/logout", (req, res) =>
{
    let signedIn = false;
    req.session.destroy();
    res.redirect("/");
});

router.get("/settings", async (req, res) =>
{
    if (req.session.isLoggedIn)
    {
        let person = req.session.user[0];
        let signedIn = true;
        let data = {
            title: "Din patient profil | Digi vaccin",
            signedIn,
            person: person,
            person,
            isStaff: false,
            errors
        }
        res.render("pages/pat/settings", data);
        errors = [];
    } else
    {
        res.redirect("/patient/login");
    }
});

router.post("/settings", async (req, res) =>
{
    if (req.session.isLoggedIn)
    {
        let oldPassword = req.body.old_pass;
        let newPassword = req.body.new_pass;
        let confirmPassword = req.body.rep_pass;
        let person = req.session.user[0];
        // regex for email
        let emailRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // regex for password
        var mediumStrength = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        let isOldPass = false;
        let isPassword = false;
        let isEmail = false;

        bcrypt.compare(oldPassword, person.password, async (err, result) =>
        {
            if (err) console.log(err);
            if (result)
            {
                if (newPassword !== confirmPassword)
                {
                    errors.push("Ditt nya lösenord matchar inte ditt bekräftelseskrevna lösenord!");
                } else
                {
                    if(mediumStrength.test(newPassword))
                    {
                        isPassword = true;
                    } else
                    {
                        errors.push("Ditt nya lösenord måste innehålla minst 8 tecken och en bokstav och ett nummer!");
                    }
                }

                if (emailRegx.test(req.body.mail))
                {
                    isEmail = true;
                    
                } else
                {
                    errors.push("Ditt mailadress är felaktigt!");
                }
                if (isEmail && isPassword)
                {
                    let passwordHash = await bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
                    patientSetter.updatePatient(person.id, req.body.mail, req.body.mobile, req.body.address, passwordHash);
                    const data = await ejs.renderFile(process.cwd() + "/views/mail/information-change.ejs");
                    let info = await transporter.sendMail({
                        from: '"Digi vaccin" <abodsakka2001@gmail.com>',
                        to: req.body.mail,
                        subject: "Digi vaccin - Ny patient information",
                        text: `Hej ${req.body.first_name}! Din använder information har ändrats om det inte var du så ber vi dig omdelbart ändra din lösenord`,
                        html: data
        
                    });
                    res.redirect("/patient/profil");
                    
                } else
                {
                    res.redirect("/patient/settings");
                }
            } else
            {
                errors.push("Ditt gamla lösenord är felaktigt!");
            }
        });
    } else
    {
        res.redirect("/patient/login");
    }
});

module.exports = router;