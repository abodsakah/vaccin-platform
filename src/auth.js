/**
* 
*  @description Main authinaction module\n the users gets autherized by their personal number and there password after that the password is going to be compared to a bcrypt hash from the database where it is amysql database. database accessing is done by the promise-mysql module.
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

/**
* @description gets the user's personnumber and password
* @param {*} personnummer is the personal number issued by the swedish govermant for the person in question 
*/
async function getPat(personnummer)
{
    let sql = "SELECT * FROM patients where personnummer=?";
    let res = await db.query(sql, [personnummer]);
    return res;
}
/**
 * Function to get staff info for authinaction
 * @param {*} username The username that was assigned to the staff by the web admin
 * @returns 
 */
async function getStaff(username)
{
    let sql = "SELECT * FROM staff_login where username=?";
    let res = await db.query(sql, [username]);
    return res;
}

module.exports = {
    getPat: getPat,
    getStaff: getStaff
}