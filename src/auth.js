const { Sequelize, QueryTypes } = require('sequelize');
const dotenv = require('dotenv').config({ path: './config/.env' });

const db = new Sequelize(dotenv.parsed.DB_NAME, dotenv.parsed.DB_LOGIN, dotenv.parsed.DB_PASSWORD, {
    host: dotenv.parsed.DB_HOST,
    dialect: 'mariadb',
});

/**
* @description gets the user's personnumber and password
* @param {*} personnummer is the personal number issued by the swedish govermant for the person in question 
*/
async function getPat(personnummer)
{
    const result = await db.query("SELECT * FROM patients where personnummer=?", { type: QueryTypes.SELECT, replacements: [personnummer] })
    return result;
}

/**
 * Function to get staff info for authinaction
 * @param {*} username The username that was assigned to the staff by the web admin
 * @returns 
 */
async function getStaff(username)
{
    const result = await db.query("SELECT * FROM staff_login where username=?", { type: QueryTypes.SELECT, replacements: [username] })
    return result;
}

module.exports = {
    getPat,
    getStaff
}