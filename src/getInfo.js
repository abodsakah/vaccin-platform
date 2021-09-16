/**
* 
*  @description Main getter for users details and info
* 
* 
*/

"use strict"

const mysql = require('promise-mysql');
// const bcrypt = require('bcryptjs');
const dotenv = require('dotenv').config({ path: './config/.env' });
let db;

(async function (err)
{
    db = await mysql.createConnection({
        host: dotenv.parsed.DB_HOST,
        user: dotenv.parsed.DB_LOGIN,
        password: dotenv.parsed.DB_PASSWORD,
        database: dotenv.parsed.DB_NAME,
        charset: dotenv.parsed.DB_CHAR,
        multipleStatements: dotenv.parsed.DB_MULTI
    });
    if (err){console.log(err);};
    process.on('exit', () => {db.end()});
})();

async function getVaccinByPatient(patient_id)
{
    let sql = "SELECT * FROM `doses_info` WHERE patient_id = ?";
    let res = await db.query(sql, [patient_id]);
    return res;
}

module.exports = {
    getVaccinByPatient
}