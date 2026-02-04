
// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require('../models/weaponsModel');

// CREATE
module.exports.createWeapon = (req, res) => {
    if (
        req.body.weapon_name === undefined ||
        req.body.required_level === undefined
    ) {
        return res.status(400).json({
            message: "Missing required data"
        });
    }

    const data = {
        weapon_name: req.body.weapon_name,
        required_level: req.body.required_level
    };

    model.insertWeapon(data, (error, results) => {
        if (error) return res.status(500).json(error);

        res.status(201).json({
            weapon_id: results.insertId,
            ...data
        });
    });
};

// READ ALL
module.exports.readAllWeapons = (req, res) => {
    model.selectAllWeapons((error, results) => {
        if (error) return res.status(500).json(error);
        res.status(200).json(results);
    });
};

// READ BY ID
module.exports.readWeaponById = (req, res) => {
    const data = { weapon_id: req.params.weapon_id };

    model.selectWeaponById(data, (error, results) => {
        if (error) return res.status(500).json(error);

        if (results.length === 0) {
            return res.status(404).json({ message: "Weapon not found" });
        }

        res.status(200).json(results[0]);
    });
};

// UPDATE
module.exports.updateWeaponById = (req, res) => {
    if (
        req.body.weapon_name === undefined ||
        req.body.required_level === undefined
    ) {
        return res.status(400).json({
            message: "Missing required data"
        });
    }

    const data = {
        weapon_id: req.params.weapon_id,
        weapon_name: req.body.weapon_name,
        required_level: req.body.required_level
    };

    model.updateWeaponById(data, (error, results) => {
        if (error) return res.status(500).json(error);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Weapon not found" });
        }

        res.status(200).json({ message: "Weapon updated successfully" });
    });
};

// DELETE
module.exports.deleteWeaponById = (req, res) => {
    const data = { weapon_id: req.params.weapon_id };

    model.deleteWeaponById(data, (error, results) => {
        if (error) return res.status(500).json(error);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Weapon not found" });
        }

        res.status(204).send();
    });
};
