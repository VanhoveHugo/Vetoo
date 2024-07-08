-- Create a user with limited privileges
CREATE USER 'webuser'@'%' IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE, DELETE ON vetoo.* TO 'webuser'@'%';

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS `vetoo`;

-- Use the created database
USE `vetoo`;

-- Create the users table
CREATE TABLE IF NOT EXISTS `users` (
    id INT NOT NULL AUTO_INCREMENT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    PRIMARY KEY (id)
);

-- Create the pets table
CREATE TABLE IF NOT EXISTS `pets` (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    birthdate DATE,
    name VARCHAR(10) NOT NULL,
    type ENUM('d', 'c', 'n') NOT NULL,
    gender ENUM('m', 'f'),
    chip VARCHAR(10) UNIQUE,
    picture_url VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX (user_id)
);

-- Create the appointments table
CREATE TABLE IF NOT EXISTS `appointments` (
    id INT NOT NULL AUTO_INCREMENT,
    pet_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    meet_at DATETIME NOT NULL,
    title VARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX (pet_id)
);

-- Create the weights table
CREATE TABLE IF NOT EXISTS `weights` (
    id INT NOT NULL AUTO_INCREMENT,
    pet_id INT NOT NULL,
    date DATE NOT NULL,
    weight DECIMAL(5, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (pet_id) REFERENCES pets(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE INDEX (date, pet_id),
    INDEX (pet_id)
);
