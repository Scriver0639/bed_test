const pool = require("../services/db");

const SQLSTATEMENT = `
DROP TABLE IF EXISTS Users;

DROP TABLE IF EXISTS WellnessChallenge;

DROP TABLE IF EXISTS UserCompletion;

DROP TABLE IF EXISTS Level;

DROP TABLE IF EXISTS Weapon;

DROP TABLE IF EXISTS UserWeapon;

CREATE TABLE Users (
user_id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(255) NOT NULL,
points INT DEFAULT 0,
level INT DEFAULT 1,
password VARCHAR(255) NOT NULL
);

CREATE TABLE WellnessChallenge (
challenge_id INT AUTO_INCREMENT PRIMARY KEY,
creator_id INT NOT NULL,
description TEXT NOT NULL,
points INT NOT NULL
);

CREATE TABLE UserCompletion (
completion_id INT AUTO_INCREMENT PRIMARY KEY,
challenge_id INT NOT NULL,
user_id INT NOT NULL,
details TEXT
);

CREATE TABLE Level (
  level_id INT AUTO_INCREMENT PRIMARY KEY,
  level_number INT NOT NULL,
  required_points INT NOT NULL
);

CREATE TABLE Weapon (
  weapon_id INT AUTO_INCREMENT PRIMARY KEY,
  weapon_name VARCHAR(100) NOT NULL,
  required_level INT NOT NULL
);

CREATE TABLE UserWeapon (
  user_weapon_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  weapon_id INT NOT NULL
);

INSERT INTO Level (level_number, required_points) VALUES
(1, 0),
(2, 100),
(3, 225), 
(4, 375),
(5, 550),
(6, 750),
(7, 975),
(8, 1225),
(9, 1500),
(10, 1800);

INSERT INTO Weapon (weapon_name, required_level) VALUES
('Wooden Sword', 1),
('Stone Sword', 2),
('Iron Sword', 3),
('Dual-Wielding Katanas', 4),
('Throwable Axe', 5),
('Shadow Blade', 6),
('Great Dragon Spear', 7),
('Legion Staff', 8),
('Sea Halberd', 9),
('Divine Rapier', 10);

`;

pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully:", results);
  }
  process.exit();
});