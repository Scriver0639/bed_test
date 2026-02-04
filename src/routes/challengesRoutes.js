// ##############################################################
// REQUIRE MODULES
// ##############################################################
const express = require('express');

// ##############################################################
// CREATE ROUTER
// ##############################################################
const router = express.Router();
const controller = require('../controllers/challengesController');
const completionController = require('../controllers/completionsController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// ##############################################################
// DEFINE ROUTES
// ##############################################################

router.post('/', jwtMiddleware.verifyToken, controller.createNewChallenge);
router.get('/', jwtMiddleware.verifyToken, controller.readAllChallenges);
router.delete('/:challenge_id', jwtMiddleware.verifyToken, controller.checkChallengeOwner, controller.deleteChallengesById);
router.put('/:challenge_id', jwtMiddleware.verifyToken, controller.checkChallengeOwner, controller.updateChallengesById);
router.post('/:challenge_id/completions', jwtMiddleware.verifyToken, completionController.checkUserAndChallengeExist, completionController.checkCompletionUnique, completionController.createCompletion);
router.get('/:challenge_id', completionController.checkChallengeHasCompletions, completionController.getCompletionsByChallengeId);


module.exports = router;