// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/levelsModel.js");

// CREATE
module.exports.createLevel = (req, res) => {
    if (
        req.body.level_number === undefined ||
        req.body.required_points === undefined
    ) {
        return res.status(400).json({
            message: "Missing required data"
        });
    }

    const data = {
        level_number: req.body.level_number,
        required_points: req.body.required_points
    };

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        res.status(201).json({
            level_id: results.insertId,
            ...data
        });
    };

    model.insertLevel(data, callback);
};

// READ ALL
module.exports.readAllLevels = (req, res) => {
    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        res.status(200).json(results);
    };

    model.selectAllLevels(callback);
};

// READ BY ID
module.exports.readLevelById = (req, res) => {
    const data = {
        level_id: req.params.level_id
    };

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Level not found"
            });
        }

        res.status(200).json(results[0]);
    };

    model.selectLevelById(data, callback);
};

// UPDATE
module.exports.updateLevelById = (req, res) => {
    if (
        req.body.level_number === undefined ||
        req.body.required_points === undefined
    ) {
        return res.status(400).json({
            message: "Missing required data"
        });
    }

    const data = {
        level_id: req.params.level_id,
        level_number: req.body.level_number,
        required_points: req.body.required_points
    };

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Level not found"
            });
        }

        res.status(200).json({
            message: "Level updated successfully"
        });
    };

    model.updateLevelById(data, callback);
};

// DELETE
module.exports.deleteLevelById = (req, res) => {
    const data = {
        level_id: req.params.level_id
    };

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Level not found"
            });
        }

        res.status(204).send();
    };

    model.deleteLevelById(data, callback);
};