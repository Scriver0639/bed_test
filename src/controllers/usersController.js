// ##############################################################
// REQUIRE MODULES
// ##############################################################
const model = require("../models/usersModel.js");
const jwtMiddleware = require('../middlewares/jwtMiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');


//create user
module.exports.createNewUser = (req, res, next) => {
    if (req.body.username == undefined) {
        res.status(400).send("Missing required data");
        return;
    }

    const data = {
        username: req.body.username,
        password: res.locals.hash
    }

    const callback = (error, results, fields) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(201).json({
                "user_id": results.insertId,
                "username": req.body.username,
                "points": 0,
                "level": 1
            });
        }
    }

    model.insertSingle(data, callback);
}

//Middleware Function for checking if username exists
module.exports.checkUsernameExists = (req, res, next) => {
    const data = {
        username: req.body.username,
        user_id: req.params.user_id
    };

    const callback = (error, results) => {
        if (error) {
            res.status(500).json(error);
            return;
        }

        if (results.length > 0) {
            res.status(409).json({
                message: "Username already exists"
            });
            return;
        }

        next();
    };

    model.selectUserByUsername(data, callback);
};

//read all users
module.exports.readAllUsers = (req, res, next) => {
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllTrees:", error);
            res.status(500).json(error);
        }
        else res.status(200).json(results);
    }

    model.selectAllUsers(callback);
}

//read user by id
module.exports.readUserById = (req, res, next) => {
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readUserById:", error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).send("User not found");
            }
            else res.status(200).json(results[0]);
        }
    }

    model.selectUserById(data, callback);
}

//update user by id
module.exports.updateUsersById = (req, res, next) => {
    if (req.body.username == undefined || req.body.points == undefined || req.body.level == undefined) {
        res.status(400).json({
            message: "Missing required data"
        });
        return;
    }

    const data = {
        user_id: req.params.user_id,
        username: req.body.username,
        points: req.body.points,
        level: req.body.level
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateUsersById:", error);
            res.status(500).json(error);
        } else {
            if (results.affectedRows == 0) {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else res.status(200).json({
                message: "Updated Successfully"
            });
        }
    }

    model.updateUsersById(data, callback);
}

//check if username exists
module.exports.checkUsernameExistsForUpdate = (req, res, next) => {
    const data = {
        username: req.body.username,
        user_id: req.params.user_id
    };

    const callback = (error, results) => {
        if (error) {
            res.status(500).json(error);
            return;
        }

        if (results.length > 0) {
            res.status(409).json({
                message: "Username already exists"
            });
            return;
        }

        next();
    };

    model.selectUsernameWithDifId(data, callback);
};

//delete user
module.exports.deleteUserById = (req, res, next) => {
    const data = {
        user_id: req.params.user_id
    };

    const callback = (error, results) => {
        if (error) {
            return res.status(500).json(error);
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(204).send();
    };

    model.deleteUserById(data, callback);
};

//check if user is eligible to buy weapon
module.exports.checkWeaponEligibility = (req, res, next) => {

    const data = {
        user_id: req.params.user_id,
        weapon_id: req.params.weapon_id
    };

    const callback = (error, results) => {
        if (error) {
            res.status(500).json(error);
            return;
        }

        if (results.length === 0) {
            res.status(404).json({
                message: "User or Weapon not found"
            });
            return;
        }

        if (results[0].level < results[0].required_level) {
            res.status(403).json({
                message: "User level too low for this weapon"
            });
            return;
        }

        next();
    };

    model.selectUserWeaponEligibility(data, callback);
};

//see user inventory
module.exports.getUserInventory = (req, res, next) => {

    const data = {
        user_id: req.params.user_id
    };

    const callback = (error, results) => {
        if (error) {
            res.status(500).json(error);
            return;
        }

        res.status(200).json(results);
    };

    model.selectUserWeapons(data, callback);
};

//assign weapon to user after buying
module.exports.assignWeaponToUser = (req, res, next) => {

    const data = {
        user_id: req.params.user_id,
        weapon_id: req.params.weapon_id
    };

    const callback = (error, results) => {
        if (error) {
            res.status(500).json(error);
            return;
        }

        res.status(201).json({
            message: "Weapon added to inventory"
        });
    };

    model.insertUserWeapon(data, callback);
};

//login middleware
module.exports.loginUser = (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({ message: "Missing credentials" });
    }

    const data = {
        username: req.body.username
    };

    model.selectUserByUsername(data, (error, results) => {
        if (error) return res.status(500).json(error);

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Store hash for bcrypt
        res.locals.user = results[0];
        res.locals.hash = results[0].password;

        next();
    });
};

//login success page
module.exports.loginSuccess = (req, res) => {
    res.status(200).json({
        message: "Login successful",
        token: res.locals.token
    });
};

// READ PROFILE 
module.exports.readUserProfile = (req, res) => {
    const data = {
        user_id: res.locals.user_id
    };

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readUserProfile:", error);
            res.status(500).json(error);
        } else {
            if (results.length == 0) {
                res.status(404).json({ message: "User not found" });
            } else {
                res.status(200).json(results[0]);
            }
        }
    }

    model.selectUserById(data, callback);
}

module.exports.assignWeaponToUser = (req, res, next) => {
    const data = {
        user_id: req.params.user_id,
        weapon_id: req.params.weapon_id
    };

    // CHECK IF THEY ALREADY OWN IT
    model.checkUserWeaponOwnership(data, (error, results) => {
        if (error) {
            console.error("Error checking ownership:", error);
            res.status(500).json({ message: "Internal server error" });
        } else if (results.length > 0) {
            // IF RESULTS EXIST, THEY ALREADY OWN IT. STOP HERE.
            res.status(409).json({ message: "You already own this weapon!" });
        } else {
            // IF THEY DON'T OWN IT, PROCEED WITH ASSIGNMENT
            model.associateWeaponWithUser(data, (assignError, assignResults) => {
                if (assignError) {
                    console.error("Error assignWeaponToUser:", assignError);
                    res.status(500).json(assignError);
                } else {
                    res.status(201).json(assignResults);
                }
            });
        }
    });
};