"use strict";
let express = require("express");
let auth = require("../src/auth");
let patientSetter = require("../src/setInfo");
let vaccinInfo = require("../src/getInfo");
const dotenv = require('dotenv').config({ path: './config/.env' });

let router = express.Router();

const API_KEY = process.env.API_KEY;

router.get("/", (req, res) =>
{
   res.sendStatus(404) 
});

// Patient login Information api key
router.get("/login/token=:token&patient=:pn", async (req, res) =>
{
    const token = req.params.token;
    const pn = req.params.pn;

    if(token === API_KEY)
    {
        res.send(await auth.getPat(pn));
    } else
    {
        res.sendStatus(401);
    }
});

router.get("/info/token=:token&vaccPatient=:id", async (req, res) =>
{
    const token = req.params.token;
    const id = req.params.id;
    
    if (token === API_KEY)
    {
        res.send(await vaccinInfo.getVaccinByPatient(id));
    } else
    {
        res.sendStatus(401);
    }
});

//staff login information api key
router.get("/login/token=:token&staff=:user", async (req, res) =>
{
    const token = req.params.token;
    const user = req.params.user;

    if (token === API_KEY)
    {
        res.send(await auth.getStaff(user));
    } else
    {
        res.sendStatus(401);
    }
});

module.exports = router;
