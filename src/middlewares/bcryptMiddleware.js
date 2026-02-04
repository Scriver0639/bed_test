//////////////////////////////////////////////////////
// REQUIRE BCRYPT MODULE
//////////////////////////////////////////////////////
const bcrypt = require("bcrypt");

//////////////////////////////////////////////////////
// SET SALT ROUNDS
//////////////////////////////////////////////////////
const saltRounds = 10;

//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR COMPARING PASSWORD
//////////////////////////////////////////////////////

module.exports.comparePassword = (req, res, next) => {
    if (!req.body.password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const { password } = req.body;
    const hash = res.locals.hash;

    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!isMatch) {
            return res.status(401).json({
                message: "Wrong password"
            });
        }

        next(); // ✅ ONLY when password is correct
    });
};
//////////////////////////////////////////////////////
// MIDDLEWARE FUNCTION FOR HASHING PASSWORD
//////////////////////////////////////////////////////
module.exports.hashPassword = (req, res, next) => {
    const callback = (err, hash) => {
        if (err) {
            console.error("Error bcrypt:", err);
            res.status(500).json(err);
        } else {
            res.locals.hash = hash;
            next();
        }
    };

    bcrypt.hash(req.body.password, saltRounds, callback);
};
