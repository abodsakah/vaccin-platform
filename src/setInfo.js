/**
* 
*  @description Main setter for users details and info
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
 * 
 * @description Updates the patient's information
 * 
 * @param {*} patient_id The id of the patient to be updated
 * @param {*} first_name the new first name of the patient
 * @param {*} last_name the new last name of the patient
 * @param {*} email the new email of the patient
 * @param {*} phone the new phone number of the patient
 * @param {*} address the new address of the patient
 * @returns the status
 */
async function updatePatientById(patient_id, first_name, last_name, email, phone, address)
{
    let sql = "UPDATE `patients` SET `first_name` = ?, `last_name` = ?, `email`=?, `telephone`=?, `adress`=? WHERE `patients`.`id` = 1;"
    let res = await db.query(sql, [first_name, last_name, email, phone, address]);
    return res;
}

/**
 * 
 * @description If the patient already got the same vaccin before then the amount is going to get updated else a new entry in the tbale vaccin_patient is going to be created
 * @param {*} patient_id The id of the patient
 * @param {*} staff_id The id of the staff that addministrates the patient
 * @param {*} vaccin_id The id of the vaccin that the patient is going to get
 * @param {*} date The date the patient is going to get the vaccin
 * @returns The status
 */
async function addDose(patient_id, staff_id, vaccin_id, date)
{
    let vaccin_patient = "SELECT * FROM `doses` WHERE `patient_id` = ? AND `vaccin_id` = ? ";
    let vaccinRes = await db.query(vaccin_patient, [patient_id, parseInt(vaccin_id)]);
    if (vaccinRes[0] !== undefined)
    {
        let sql = "INSERT INTO `doses` (`id`, `patient_id`, `staff_id`, `dose`, `vaccin_id`, `date`) VALUES (NULL, ?, ?, ?, ?, ?)";
        let res = await db.query(sql, [patient_id, staff_id, vaccinRes[0].dose + 1, vaccin_id, date]);
        return res;
    } else
    {
        let sql = "INSERT INTO `doses` (`id`, `patient_id`, `staff_id`, `dose`, `vaccin_id`, `date`) VALUES (NULL, ?, ?, ?, ?, ?)";
        let res = await db.query(sql, [patient_id, staff_id, 1, vaccin_id, date]);
        return res;
    }
}

module.exports = {
    updatePatientById,
    addDose
}