/**
* 
*   The main for the web admin route.
* 
*/
"use strict"

let express = require("express");
let patientInfo = require("../src/getInfo");
let patientSetter = require("../src/setInfo");
const cron = require("node-cron");
let bcrypt = require("bcrypt");
let ejs = require("ejs");
let router = express.Router();
let nodemailer = require("nodemailer");
const dotenv = require('dotenv').config({ path: './config/.env' });

let errors = [];
var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: dotenv.parsed.MAIL,
        pass: dotenv.parsed.MAIL_PASSWORD
    }
});

router.get("/", function (req, res)
{
    if (req.session.isLoggedIn && req.session.isStaff && req.session.isAdmin)
    {
        res.redirect("/admin/dashboard");     
    } else
    {
        res.redirect("/staff/login");
    }
});

router.get("/dashboard", async (req, res) =>
{
   if(req.session.isLoggedIn && req.session.isStaff && req.session.isAdmin)
   {
       req.session.prevPage = req.originalUrl;
       let data = {
            title: "Dashboard | Digi vaccin",
            errors: errors,
            user: req.session.user,
            cookies: req.session.acceptedCookies,
       }
       res.render("pages/admin/dashboard", data);
   } else
   {
       res.redirect("/staff/login");
   }
});

module.exports = router;