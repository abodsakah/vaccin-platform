/**
* 
*  @description Main getter for users details and info
* 
* 
*/

"use strict"

const { Sequelize, QueryTypes } = require('sequelize');
const dotenv = require('dotenv').config({ path: './config/.env' });

const db = new Sequelize(dotenv.parsed.DB_NAME, dotenv.parsed.DB_LOGIN, dotenv.parsed.DB_PASSWORD, {
    host: dotenv.parsed.DB_HOST,
    dialect: 'mysql',
});

/**
 * @description Is used to get allt he vaccins a patient has
 * @param {*} patient_id the id of the patient to get the vaccins from
 * @returns all the vaccins the patient has
 */
async function getVaccinByPatient(patient_id)
{
    const result = await db.query("SELECT * FROM `vaccin_info` WHERE patient_id = ?", { type: QueryTypes.SELECT, replacements: [patient_id] })
    return result;
}
/**
 * Get the patient by the secret scanned from the QR code
 * @param {*} secret The secret to be used to get the patient's information
 * @returns The patient
 */
async function getPatientBySecret(secret)
{
    const result = await db.query("SELECT * FROM `patients` WHERE secret = ?", { type: QueryTypes.SELECT, replacements: [secret] })
    return result;
}

/**
 * @deprecated Is not used anymore
 * @disclaimer This function should not be used in produciton
 * @description Gets all the patients from patients table
 * @returns All patients in the database
 */
async function getAllPatients()
{
    const result = await db.query("SELECT * FROM `patients`", { type: QueryTypes.SELECT })
    return result
}

/**
 * @description Used to search through the patients table
 * @param {*} searchTerm the term to be searched in the patients database
 * @returns All the patients that contain the searchTerm
 */
async function getPatientBySearch(searchTerm)
{
    const result = await db.query("SELECT * FROM `patients` WHERE `personnummer`LIKE CONCAT('%', ?, '%') OR `first_name` LIKE CONCAT('%', ?, '%') OR `last_name` LIKE CONCAT('%', ?, '%');", { type: QueryTypes.SELECT ,replacements: [searchTerm, searchTerm, searchTerm] })
    return result;
}
/**
 * @description gets the patient's information
 * @param {*} patient_id The id of the patient to get
 * @returns the patient's information
 */
async function getPatientByID(patient_id)
{
    const result = await db.query("SELECT * FROM `patients` WHERE id = ?", { type: QueryTypes.SELECT, replacements: [patient_id] })
    return result;
}

async function getAllvaccines()
{
    const result = await db.query("SELECT * FROM `vaccins", { type: QueryTypes.SELECT })
    return result;
}

async function getBookingForStaff(staff_id)
{
    const result = await db.query("SELECT * FROM `patients_bookings` WHERE staff_id = ?", { type: QueryTypes.SELECT, replacements: [staff_id] })
    return result;
}

async function getBookingById(booking_id)
{
    const result = await db.query("SELECT * FROM `patients_bookings` WHERE id = ?", { type: QueryTypes.SELECT, replacements: [booking_id] })
    return result;
}

module.exports = {
    getVaccinByPatient,
    getAllPatients,
    getPatientBySearch,
    getPatientByID,
    getAllvaccines,
    getBookingForStaff,
    getBookingById,
    getPatientBySecret
}