// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

// Select user and challenge 
module.exports.selectUserAndChallenge = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT points FROM WellnessChallenge WHERE challenge_id = ?;
        SELECT user_id FROM Users WHERE user_id = ?;
    `;

    const VALUES = [data.challenge_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, (error, results) => {
        if (error) return callback(error);

        // Safety check for empty results
        callback(null, {
            challenge: results[0],
            user: results[1]
        });
    });
};

// Check if user already completed this specific challenge
module.exports.checkCompletionExists = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT completion_id 
        FROM UserCompletion 
        WHERE user_id = ? AND challenge_id = ?;
    `;
    const VALUES = [data.user_id, data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Mark challenge as completed and update points/level
module.exports.insertCompletionAndUpdatePoints = (data, callback) => {
    // 1. Insert the completion record
    // 2. Update the User's points AND Level in one go.
    // We subquery the Level table using (CurrentPoints + NewPoints)

    const SQLSTATEMENT = `
        INSERT INTO UserCompletion (challenge_id, user_id, details)
        VALUES (?, ?, ?);

        UPDATE Users
        SET 
            points = points + ?,
            level = (
                SELECT level_number 
                FROM Level 
                WHERE required_points <= (points + ?) 
                ORDER BY level_number DESC 
                LIMIT 1
            )
        WHERE user_id = ?;
    `;

    const VALUES = [
        data.challenge_id,
        data.user_id,
        data.details,
        data.points,     // Add points
        data.points,     // (Use again to calculate level)
        data.user_id     // Which user
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Select completion by challenge id
module.exports.selectCompletionsByChallengeId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT user_id, details
        FROM UserCompletion
        WHERE challenge_id = ?;
    `;

    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

// Select completion by user id
module.exports.selectCompletionsByUserId = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT challenge_id, details
        FROM UserCompletion
        WHERE user_id = ?;
    `;

    const VALUES = [data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};