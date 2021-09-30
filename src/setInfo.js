/**
* 
*  @description Main setter for users details and info
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
    const result = await db.query("UPDATE `patients` SET `first_name` = ?, `last_name` = ?, `email`=?, `telephone`=?, `adress`=? WHERE `patients`.`id` = 1;", { type: QueryTypes.UPDATE, replacements: [first_name, last_name, email, phone, address] })
    return result;
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
    

    const vaccin_patient = await db.query("SELECT * FROM `doses` WHERE `patient_id` = ? AND `vaccin_id` = ?", { type: QueryTypes.UPDATE, replacements: [patient_id, parseInt(vaccin_id)] })
    
    if (vaccin_patient !== undefined)
    {
        const result = await db.query("INSERT INTO `doses` (`id`, `patient_id`, `staff_id`, `dose`, `vaccin_id`, `date`) VALUES (NULL, ?, ?, ?, ?, ?)", { type: QueryTypes.INSERT, replacements: [patient_id, staff_id, vaccinRes[0].dose + 1, vaccin_id, date] })
        return result;
    }

    const result = await db.query("INSERT INTO `doses` (`id`, `patient_id`, `staff_id`, `dose`, `vaccin_id`, `date`) VALUES (NULL, ?, ?, ?, ?, ?)", { type: QueryTypes.INSERT, replacements: [patient_id, staff_id, 1, vaccin_id, date] })
    return result;
}
/**
 * @description adds a patient to the database
 * @param {*} first_name The first name of the patient
 * @param {*} last_name The last name of the patient
 * @param {*} email The email of the patient
 * @param {*} phone The phone number of the patient
 * @param {*} adress The adress of the patient
 * @param {*} personnummer The personnummer of the patient
 * @param {*} password The password of the patient
 * @returns 
 */
async function addUser(first_name, last_name, email, phone, adress, personnummer, password)
{
    let secret = randomSecret();
    const result = await db.query("INSERT INTO `patients` (`id`, `first_name`, `last_name`, `email`, `telephone`, `adress`, `personnummer`, `password`, `secret`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)", { type: QueryTypes.INSERT, replacements: [first_name, last_name, email, phone, adress, personnummer, password, secret] })
    return result;
}

function randomSecret()
{
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let secret = '';
    for (let i = 0; i < 32; i++)
    {
        secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
}

async function updatePatient(patient_id, mail, phone, address, new_pass)
{
    const result = await db.query("UPDATE `patients` SET `email` = ?, `telephone` = ?, `adress` = ?, `password` = ? WHERE `patients`.`id` = ?", { type: QueryTypes.UPDATE, replacements: [mail, phone, address, new_pass, patient_id] })
    return result;
}

async function bookTime(patient_id, staff_id, date, time)
{
    const result = await db.query("INSERT INTO `bookings` (`id`, `patient_id`, `staff_id`, `date_booked`, `time_booked`) VALUES (NULL, ?, ?, ?, ?)", { type: QueryTypes.INSERT, replacements: [patient_id, staff_id, date, time] })
    return result;
}

async function updateBooking(id, date, time)
{
    const result = await db.query("UPDATE `bookings` SET `date_booked` = ?, `time_booked` = ? WHERE `bookings`.`id` = ?", { type: QueryTypes.UPDATE, replacements: [date, time, id] })
    return result;
}

module.exports = {
    updatePatientById,
    addDose,
    addUser,
    updatePatient,
    bookTime,
    updateBooking
}