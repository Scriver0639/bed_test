// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
const controller = require('../controllers/levelsController');

// ##############################################################
// DEFINE ROUTES
// ##############################################################

router.post('/', controller.createLevel);
router.get('/', controller.readAllLevels);
router.get('/:level_id', controller.readLevelById);
router.put('/:level_id', controller.updateLevelById);
router.delete('/:level_id', controller.deleteLevelById);

module.exports = router;