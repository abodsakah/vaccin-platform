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

/**
 * @description Is used to get allt he vaccins a patient has
 * @param {*} patient_id the id of the patient to get the vaccins from
 * @returns all the vaccins the patient has
 */
async function getVaccinByPatient(patient_id)
{
    let sql = "SELECT * FROM `vaccin_info` WHERE patient_id = ?";
    let res = await db.query(sql, [patient_id]);
    return res;
}

/**
 * @deprecated Is not used anymore
 * @disclaimer This function should not be used in produciton
 * @description Gets all the patients from patients table
 * @returns All patients in the database
 */
async function getAllPatients()
{
    let sql = "SELECT * FROM `patients`";
    let res = await db.query(sql);
    return res;
}

/**
 * @description Used to search through the patients table
 * @param {*} searchTerm the term to be searched in the patients database
 * @returns All the patients that contain the searchTerm
 */
async function getPatientBySearch(searchTerm)
{
    let sql = "CALL searchPatient(?)"
    let res = await db.query(sql, [searchTerm]);
    return res;
}
/**
 * @description gets the patient's information
 * @param {*} patient_id The id of the patient to get
 * @returns the patient's information
 */
async function getPatientByID(patient_id)
{
    let sql = "SELECT * FROM `patients` WHERE id = ?";
    let res = await db.query(sql, [patient_id]);
    return res;
}

async function getAllvaccines()
{
    let sql = "SELECT * FROM `vaccins`";
    let res = await db.query(sql);
    return res;
}

async function getBookingForStaff(staff_id)
{
    let sql = "SELECT * FROM `patients_bookings` WHERE staff_id = ?";
    let res = await db.query(sql, [staff_id]);
    return res;
}

async function getBookingById(booking_id)
{
    let sql = "SELECT * FROM `patients_bookings` WHERE id = ?";
    let res = await db.query(sql, [booking_id]);
    return res;
}

module.exports = {
    getVaccinByPatient,
    getAllPatients,
    getPatientBySearch,
    getPatientByID,
    getAllvaccines,
    getBookingForStaff,
    getBookingById
}