"use strict";

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

const router = express.Router();
const port = process.env.PORT || 3000;

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


app.use(express.static("public"));
app.set('view engine', 'ejs');


app.get("/", (req, res) =>
{
    let signedIn = false;
    if (req.session.loggedIn)
    {
        signedIn = true;
    }
    let data = {
        title: "Välkomen till vaccin beviset",
        signedIn
    }
    res.render("pages/index", data);
});

app.get("/pat/login", (req, res) =>
{
    if (!req.session.loggedIn)
    {
        let data = {
            title: "Logga in | vaccin beviset",
        }
        res.render("pages/pat/login", data);
   }
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