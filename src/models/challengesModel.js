// ##############################################################
// REQUIRE MODULES
// ##############################################################
const pool = require('../services/db');

//create challenge
module.exports.insertChallenges = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO WellnessChallenge (creator_id, description, points)
        VALUES (?, ?, ?);
    `;

    const VALUES = [
        data.user_id,
        data.description,
        data.points
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//read all challenges
module.exports.selectAllChallenges = (data, callback) => {

    const SQLSTATEMENT = `
        SELECT WellnessChallenge.* FROM WellnessChallenge
        LEFT JOIN UserCompletion 
        ON WellnessChallenge.challenge_id = UserCompletion.challenge_id 
        AND UserCompletion.user_id = ?
        WHERE WellnessChallenge.creator_id = ?
        AND UserCompletion.completion_id IS NULL;
    `;

    // We use data.user_id twice: once for the JOIN, once for the WHERE
    const VALUES = [data.user_id, data.user_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//delete challenge
module.exports.deleteById = (data, callback) => {
    const SQLSTATEMENT = `
    DELETE FROM WellnessChallenge
    where challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback)
}

//read challenge by id
module.exports.selectChallengeById = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM WellnessChallenge
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//user_id is used only for ownership validation
//creator_id is immutable and not updated

module.exports.updateChallengesById = (data, callback) => {
    const SQLSTATEMENT = `
        UPDATE WellnessChallenge
        SET description = ?, points = ?
        WHERE challenge_id = ?;
    `;
    const VALUES = [data.description, data.points, data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//Middleware helper
module.exports.checkUserAndChallengeExist = (data, callback) => {
    const SQLSTATEMENT = `
        SELECT * FROM Users WHERE user_id = ?;
        SELECT * FROM WellnessChallenge WHERE challenge_id = ?;
    `;

    const VALUES = [data.user_id, data.challenge_id];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

//Insert completion + update points
module.exports.insertCompletionAndReward = (data, callback) => {
    const SQLSTATEMENT = `
        INSERT INTO UserCompletion (user_id, challenge_id, details)
        VALUES (?, ?, ?);

        UPDATE Users
        SET points = points + ?
        WHERE user_id = ?;
    `;

    const VALUES = [
        data.user_id,
        data.challenge_id,
        data.details,
        data.points,
        data.user_id
    ];

    pool.query(SQLSTATEMENT, VALUES, callback);
};

