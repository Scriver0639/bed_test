// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require('../models/completionsModel');

// 1. Middleware: Check if User and Challenge exist
module.exports.checkUserAndChallengeExist = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id,
        user_id: res.locals.user_id
    };

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        if (results.challenge.length === 0 || results.user.length === 0) {
            return res.status(404).json({
                message: "User or Challenge not found"
            });
        }

        req.challengePoints = results.challenge[0].points;
        next();
    };

    model.selectUserAndChallenge(data, callback);
};

// 2. Middleware: Check if already completed
module.exports.checkCompletionUnique = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id,
        user_id: res.locals.user_id
    };

    model.checkCompletionExists(data, (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        if (results.length > 0) {
            return res.status(409).json({
                message: "You have already completed this quest!"
            });
        }

        next();
    });
};

// 3. Final Controller: Create completion and award points
module.exports.createCompletion = (req, res, next) => {
    // FIX: specific check to ensure req.body exists
    const details = (req.body && req.body.details) ? req.body.details : "Quest Completed";

    const data = {
        challenge_id: req.params.challenge_id,
        user_id: res.locals.user_id,
        details: details,
        points: req.challengePoints
    };

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        res.status(201).json({
            message: "Quest Complete!",
            xp_gained: data.points,
            completion_id: results[0].insertId
        });
    };

    model.insertCompletionAndUpdatePoints(data, callback);
};

// Check if challenge has ANY completions (for stats)
module.exports.checkChallengeHasCompletions = (req, res, next) => {
    const data = {
        challenge_id: req.params.challenge_id
    };

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "No users have attempted this challenge"
            });
        }

        req.completions = results;
        next();
    };

    model.selectCompletionsByChallengeId(data, callback);
};

module.exports.getCompletionsByChallengeId = (req, res, next) => {
    res.status(200).json(req.completions);
};

module.exports.getCompletionsByUserId = (req, res, next) => {
    const data = {
        user_id: req.params.user_id
    };

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User has no completions"
            });
        }

        res.status(200).json(results);
    };

    model.selectCompletionsByUserId(data, callback);
};