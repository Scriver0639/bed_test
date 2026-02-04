// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

// Create level
module.exports.insertLevel = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO Level (level_number, required_points)
        VALUES (?, ?);
    `;

    const VALUES = [data.level_number, data.required_points];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Read all levels
module.exports.selectAllLevels = (callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Level
        ORDER BY level_number ASC;
    `;

    pool.query(SQLSTATEMENT, callback);
};

// Read level by ID
module.exports.selectLevelById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Level
        WHERE level_id = ?;
    `;

    const VALUES = [data.level_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Update level
module.exports.updateLevelById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE Level
        SET level_number = ?, required_points = ?
        WHERE level_id = ?;
    `;

    const VALUES = [
        data.level_number,
        data.required_points,
        data.level_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Delete level
module.exports.deleteLevelById = (data, callback) => {
    const SQLSTATEMENT = `
        DELETE FROM Level
        WHERE level_id = ?;
    `;

    const VALUES = [data.level_id];
    pool.query(SQLSTATEMENT, VALUES, callback);
};