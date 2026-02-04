// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
const controller = require('../controllers/completionsController');

// ##############################################################
// DEFINE ROUTES
// ##############################################################

router.get('/users/:user_id', controller.getCompletionsByUserId);

module.exports = router;