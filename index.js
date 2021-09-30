"use strict";
/* -------------------------------------------------------------------------- */
/*                                Main imports                                */
/* -------------------------------------------------------------------------- */

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const auth = require("./src/auth");
const app = express();
var back = require('express-back');

const patientRoute = require("./routes/patient");
const staffRoute = require("./routes/staff");
const adminRoute = require("./routes/admin");
const APIRoute = require("./API/apiRoute");
/* -------------------------------------------------------------------------- */
/*                            Website configuration                           */
/* -------------------------------------------------------------------------- */

const router = express.Router();
const port = process.env.PORT || 3500;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: "hj3b234€kfe87374$n",
    name: "Vaccin platform",
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week,
    },
    SameSite: "Strict"
}));
app.use(back());
/* -------------------------------------------------------------------------- */
/*                                 Cron jobs                                  */
/* -------------------------------------------------------------------------- */


app.use(express.static("public"));
app.use("/patient", patientRoute);
app.use("/staff", staffRoute);
app.use("/admin", adminRoute);
app.use("/api", APIRoute);
app.set('view engine', 'ejs');
app.disable('x-powered-by');

/* -------------------------------------------------------------------------- */
/*                                  Handlers                                  */
/* -------------------------------------------------------------------------- */

app.get("/", (req, res) =>
{
    let signedIn = false;
    let person;
    let isStaff = false;
    if (req.session.isLoggedIn)
    {
        signedIn = true;
        person = req.session.user[0];
    }
    if (req.session.isStaff)
    {
        isStaff = true;
    }
    let cookies = req.session.acceptedCookies;
    req.session.prevPage = req.originalUrl;
    let data = {
        cookies,
        title: "Välkomen till vaccin beviset",
        signedIn,
        person,
        isStaff
    }
    res.render("pages/index", data);
});

app.get("/accept-cookies", (req, res) =>
{
    req.session.acceptedCookies = true;
    res.redirect(req.session.prevPage);
});

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});
app.listen(port, () =>
{
    console.log(`Server started on port ${port}`);
});

module.exports = app;