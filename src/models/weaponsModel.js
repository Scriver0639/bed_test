// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

// Create weapon
module.exports.insertWeapon = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Weapon (weapon_name, required_level)
        VALUES (?, ?);
    `;

    pool.query(SQLSTATEMENT, [
        data.weapon_name,
        data.required_level
    ], callback);
};

// Read all weapons
module.exports.selectAllWeapons = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Weapon;
    `;

    pool.query(SQLSTATEMENT, callback);
};

// Read weapon by ID
module.exports.selectWeaponById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Weapon
        WHERE weapon_id = ?;
    `;

    pool.query(SQLSTATEMENT, [data.weapon_id], callback);
};

// Update weapon
module.exports.updateWeaponById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Weapon
        SET weapon_name = ?, required_level = ?
        WHERE weapon_id = ?;
    `;

    pool.query(SQLSTATEMENT, [
        data.weapon_name,
        data.required_level,
        data.weapon_id
    ], callback);
};

// Delete weapon
module.exports.deleteWeaponById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Weapon
        WHERE weapon_id = ?;
    `;

    pool.query(SQLSTATEMENT, [data.weapon_id], callback);
};
