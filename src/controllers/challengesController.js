// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/challengesModel.js");

//create challenge
module.exports.createNewChallenge = (req, res, next) => {
    if (
        req.body.description == undefined ||
        req.body.points == undefined
    ) {
        res.status(400).json({
            message: "Missing required data"
        });
        return;
    }

    const data = {
        user_id: res.locals.user_id,
        description: req.body.description,
        points: req.body.points
    };

    const callback = (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(201).json({
                challenge_id: results.insertId,
                creator_id: data.user_id,
                description: data.description,
                points: data.points
            });
        }
    };

    model.insertChallenges(data, callback);
};

//read all challenges
module.exports.readAllChallenges = (req, res, next) => {
    // 1. Create data object with the logged-in user's ID
    const data = {
        user_id: res.locals.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllChallenges:", error);
            res.status(500).json(error);
        }
        else res.status(200).json(results);
    }

    // 2. Pass 'data' to the model
    model.selectAllChallenges(data, callback);
};
//delete challenge 
module.exports.deleteChallengesById = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            return res.status(500).json(error);
        } else {
            if (results.affectedRows == 0) {
                return res.status(404).json({
                    message: "Challenge does not exist"
                });

            }
            else res.status(204).send();
        }
    }
    model.deleteById(data, callback);
};

//update challenge
module.exports.updateChallengesById = (req, res, next) => {
    if (
        req.body.description == undefined ||
        req.body.points == undefined ||
        req.body.user_id == undefined
    ) {
        res.status(400).json({
            message: "Missing required data"
        });
        return;
    }

    const data = {
        challenge_id: req.params.challenge_id,
        description: req.body.description,
        points: req.body.points
    };

    const callback = (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json({
                challenge_id: data.challenge_id,
                description: data.description,
                points: data.points,
                creator_id: req.body.user_id
            });
        }
    };

    model.updateChallengesById(data, callback);
};


//middleware helper - check challenge belongs to owner
module.exports.checkChallengeOwner = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id,
        user_id: res.locals.user_id
    };

    const callback = (error, results) => {
        if (error) {
            res.status(500).json(error);
            return;
        }

        // Challenge does not exist
        if (results.length == 0) {
            res.status(404).json({
                message: "Challenge not found"
            });
            return;
        }

        // Creator mismatch
        if (results[0].creator_id != data.user_id) {
            res.status(403).json({
                message: "Forbidden: Not challenge owner"
            });
            return;
        }

        next();
    };

    model.selectChallengeById(data, callback);
};

// Middleware - check user & challenge exist
module.exports.checkUserAndChallengeExists = (req, res, next) => {
    if (req.body.user_id == undefined) {
        return res.status(400).json({
            message: "Missing user_id"
        });
    }

    const data = {
        user_id: req.body.user_id,
        challenge_id: req.params.challenge_id
    };

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        // results[0] → user
        // results[1] → challenge
        if (results[0].length == 0 || results[1].length == 0) {
            return res.status(404).json({
                message: "User or Challenge not found"
            });
        }

        // store challenge points for next controller
        req.challengePoints = results[1][0].points;
        next();
    };

    model.checkUserAndChallengeExist(data, callback);
};

// Real controller - create completion + reward points
module.exports.createCompletion = (req, res) => {
    const data = {
        user_id: req.body.user_id,
        challenge_id: req.params.challenge_id,
        details: req.body.details || "",
        points: req.challengePoints
    };

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        res.status(201).json({
            completion_id: results.insertId,
            user_id: data.user_id,
            challenge_id: data.challenge_id,
            details: data.details
        });
    };

    model.insertCompletionAndReward(data, callback);
};

