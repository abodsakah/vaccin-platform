/**
* 
*   The route for the patient login and info
* 
*/
"use strict";

let express = require("express");
let auth = require("../src/auth");
let vaccinInfo = require("../src/getInfo");
let bcrypt = require("bcrypt");
let router = express.Router();

let loginErrors = []

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
        let data = {
            title: "Din patient profil | Digi vaccin",
            signedIn: req.session.loggedIn,
            person: person,
            vaccins
        }
        res.render("pages/pat/profile", data);
    } else
    {
        res.redirect("/patient/login");
    }
});

module.exports = router;