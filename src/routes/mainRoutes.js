// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');
const router = express.Router();

// ##############################################################
// CREATE ROUTER
// ##############################################################
const userRoutes = require('./usersRoutes');
const challengesRoutes = require('./challengesRoutes')
const completionRoutes = require('./completionsRoutes')
const levelsRoutes = require('./levelsRoutes')
const weaponRoutes = require('./weaponsRoutes')

// ##############################################################
// DEFINE ROUTES
// ##############################################################
router.use("/users", userRoutes);
router.use("/challenges", challengesRoutes)
router.use("/completions", completionRoutes)
router.use("/levels", levelsRoutes)
router.use("/weapons", weaponRoutes)

module.exports = router;