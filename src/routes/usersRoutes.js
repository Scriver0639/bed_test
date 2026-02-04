// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
const controller = require('../controllers/usersController');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// ##############################################################
// DEFINE ROUTES
// ##############################################################

router.post('/', bcryptMiddleware.hashPassword, controller.checkUsernameExists, controller.createNewUser);
router.get('/', controller.readAllUsers)
router.get('/profile', jwtMiddleware.verifyToken, controller.readUserProfile);
router.get('/:user_id', controller.readUserById)
router.put('/:user_id', controller.checkUsernameExistsForUpdate, controller.updateUsersById)
router.delete('/:user_id', controller.deleteUserById);
router.get('/:user_id/weapons', controller.getUserInventory);
router.post('/:user_id/weapons/:weapon_id', jwtMiddleware.verifyToken, controller.checkWeaponEligibility, controller.assignWeaponToUser);
router.post('/login', controller.loginUser, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);

module.exports = router;