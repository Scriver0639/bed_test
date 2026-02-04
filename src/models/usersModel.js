// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

//Create user
module.exports.insertSingle = (data, callback) => {
    const SQLSTATMENT = `
    INSERT INTO Users (username, password)
    VALUES (?, ?);
    `;
    const VALUES = [data.username, data.password];

    pool.query(SQLSTATMENT, VALUES, callback);
}

//Select user by username
module.exports.selectUserByUsername = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Users
        WHERE username = ?;
    `;

    const VALUES = [data.username];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//Read all users
module.exports.selectAllUsers = (callback) => {
    const SQLSTATMENT = `
    SELECT * FROM Users;
    `;

    pool.query(SQLSTATMENT, callback);
}

//Select user by id
module.exports.selectUserById = (data, callback) => {
    const SQLSTATMENT = `
    SELECT * FROM Users
    WHERE user_id = ?;
    `;
    const VALUES = [data.user_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

//update user by id
module.exports.updateUsersById = (data, callback) => {
    const SQLSTATMENT = `
    UPDATE Users 
    SET username = ?, points = ?, level = ?
    WHERE user_id = ?;
    `;
    const VALUES = [data.username, data.points, data.level, data.user_id];

    pool.query(SQLSTATMENT, VALUES, callback);
}

//check if username is taken by another user
module.exports.selectUsernameWithDifId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Users
        WHERE username = ?
        AND user_id != ?;
    `;

    const VALUES = [data.username, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//delete user by id
module.exports.deleteUserById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Users
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Get user inventory
module.exports.selectUserWeapons = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT Weapon.weapon_id, Weapon.weapon_name, Weapon.required_level
        FROM UserWeapon
        JOIN Weapon ON UserWeapon.weapon_id = Weapon.weapon_id
        WHERE UserWeapon.user_id = ?;
    `;

    const VALUES = [data.user_id]
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Assign weapon to user
module.exports.insertUserWeapon = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO UserWeapon (user_id, weapon_id)
        VALUES (?, ?);
    `;

    const VALUES = [data.user_id, data.weapon_id]

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//check if user is eligible to buy weapon
module.exports.selectUserWeaponEligibility = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT Users.level, Weapon.required_level
        FROM Users
        JOIN Weapon ON 1=1
        WHERE Users.user_id = ?
        AND Weapon.weapon_id = ?;
    `;

    const VALUES = [
        data.user_id,
        data.weapon_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Check if user already has this specific weapon
module.exports.checkUserWeaponOwnership = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM UserWeapon 
        WHERE user_id = ? AND weapon_id = ?;
    `;
    const VALUES = [data.user_id, data.weapon_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

