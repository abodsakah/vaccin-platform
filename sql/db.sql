/*create database vaccin app */
DROP DATABASE IF EXISTS `vaccin_app`;
CREATE DATABASE `vaccin_app` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE vaccin_app;

/* table for patients */
DROP TABLE IF EXISTS `patients`;
CREATE TABLE `patients` (
    id INT(11) NOT NULL AUTO_INCREMENT,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    telephone int(11) NOT NULL,
    adress varchar(255) NOT NULL,
    personnummer int(12) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/* databse for vaccins */
DROP TABLE IF EXISTS `vaccins`;
CREATE TABLE `vaccins` (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/* table for vaccins_patients */
DROP TABLE IF EXISTS `vaccins_patients`;
CREATE TABLE `vaccins_patients` (
    id INT(11) NOT NULL AUTO_INCREMENT,
    patient_id INT(11) NOT NULL,
    vaccin_id INT(11) NOT NULL,
    dose int(11) NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (vaccin_id) REFERENCES vaccins(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/* table for doses */
DROP TABLE IF EXISTS `doses`;
CREATE TABLE `doses` (
    id INT(11) NOT NULL AUTO_INCREMENT,
    patient_id INT(11) NOT NULL,
    staff_id int(11) NOT NULL,
    dose int(11) NOT NULL,
    vaccin_id INT(11) NOT NULL,
    date varchar NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (vaccin_id) REFERENCES vaccins(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (staff_id) REFERENCES staff_login(id),
    FORIGN KEY (vaccin_id) REFERENCES vaccins(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


/* table for staff login */
DROP TABLE IF EXISTS `staff_login`;
CREATE TABLE `staff_login` (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    personnummer int(12) NOT NULL,
    adress varchar(255) NOT NULL,
    telephone int(11) NOT NULL,
    title varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/* table for bookings */
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
    id INT(11) NOT NULL AUTO_INCREMENT,
    patient_id INT(11) NOT NULL,
    staff_id INT(11) NOT NULL,
    date_booked date NOT NULL,
    time_booked time NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (staff_id) REFERENCES staff_login(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/* tables for website debuggning */
DROP TBALE IF EXISTS `requests`;
CREATE TABLE `requests` (
    id INT(11) NOT NULL AUTO_INCREMENT,
    request_date datetime NOT NULL,
    request_type varchar(255) NOT NULL,
    request_data text NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `errors`;
CREATE TABLE `errors` (
    id INT(11) NOT NULL AUTO_INCREMENT,
    error_date datetime NOT NULL,
    error_type varchar(255) NOT NULL,
    error_data text NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP VIEW IF EXITS vaccin_info;
CREATE VIEW vaccin_info AS
    SELECT
        vaccins.id,
        vaccins.name,
        doses.patient_id,
        doses.vaccin_id,
        doses.dose
        CONCAT(patients.first_name, ' ', patients.last_name) AS patient_name,
        CONCAT(staff_login.first_name, ' ', staff_login.last_name) AS staff_name
    FROM
    vaccins
    JOIN doses ON vaccins.id = doses.vaccin_id
    JOIN patients ON doses.patient_id = patients.id
    JOIN staff_login ON doses.staff_id = staff_login.id
    ORDER BY vaccins.id;


DROP VIEW IF EXISTS doses;
CREATE VIEW doses AS
SELECT
    doses.id,
    doses.staff_id,
    doses.dose,
    doses.date,
    CONCAT(patients.first_name, ' ', patients.last_name) AS patient_name,
    CONCAT(staff_login.first_name, ' ', staff_login.last_name) AS staff_name,
    vaccin_info.name,
    vaccin_info.patient_id,
    vaccin_info.vaccin_id
FROM
    doses
        JOIN
            patients ON
                patients.id = doses.patient_id
        JOIN
            staff_login ON
                staff_login.id = doses.staff_id
        JOIN
            vaccin_info ON
                vaccin_info.patient_id = doses.patient_id;
         
         
-- Procuder
DROP PROCEDURE IF EXISTS `searchPatient`;
DELIMITER ;;
CREATE PROCEDURE `searchPatient`(IN seacrhTerm varchar(255))
BEGIN
    SELECT * FROM `patients` WHERE `personnummer`LIKE CONCAT('%', seacrhTerm, '%') OR `first_name` LIKE CONCAT('%', seacrhTerm, '%') OR `last_name` LIKE CONCAT('%', seacrhTerm, '%');
END;;
DELIMITER ;

-- view for patients and booking
DROP VIEW IF EXISTS `patients_bookings`;
CREATE VIEW `patients_bookings` AS
SELECT
patients.id,
patients.first_name,
patients.last_name,
bookings.date_booked,
bookings.time_booked,
bookings.staff_id
FROM
patients
JOIN bookings ON patients.id = bookings.patient_id
ORDER BY bookings.time_booked;
