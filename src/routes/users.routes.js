const express = require('express');
const usersController = require('../controllers/user.controller.js');
const validateParams = require('@middleware/ValidateParams.js').default;
const {
  signUpValidateSchema,
  refreshTokenValidateSchema,
} = require('@validate/schema.js');
const JWToken = require('../middleware/JWToken.js');

const router = express.Router();

router.post(
  '/sign-up',
  validateParams(signUpValidateSchema),
  usersController.signUp,
);
router.get('/profile', JWToken.verifyToken, usersController.profile);

router.post(
  '/refresh-token',
  validateParams(refreshTokenValidateSchema),
  usersController.refreshToken,
);

router.post('/signup-with-email', usersController.signUpWithEmail);
router.post('/update-avatar', usersController.updateAvatar);
router.post('/update-informations', usersController.updateInformations);

module.exports = router;
