// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
const controller = require('../controllers/weaponsController');

// ##############################################################
// DEFINE ROUTES
// ##############################################################

router.post('/', controller.createWeapon);
router.get('/', controller.readAllWeapons);
router.get('/:weapon_id', controller.readWeaponById);
router.put('/:weapon_id', controller.updateWeaponById);
router.delete('/:weapon_id', controller.deleteWeaponById);

module.exports = router;
