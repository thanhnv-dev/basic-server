const express = require('express');
const authController = require('../controllers/auth.controller.js');
const validateParams = require('../middleware/ValidateParams.js').default;
const {
  signUpValidateSchema,
  refreshTokenValidateSchema,
  signInValidateSchema,
  customTokenValidateSchema,
} = require('../validate/schema.js');

const router = express.Router();

router.post(
  '/sign-up',
  validateParams(signUpValidateSchema),
  authController.signUp,
);

router.post(
  '/refresh-token',
  validateParams(refreshTokenValidateSchema),
  authController.refreshToken,
);

router.post(
  '/sign-in',
  validateParams(signInValidateSchema),
  authController.signIn,
);

router.post(
  '/custom-token',
  validateParams(customTokenValidateSchema),
  authController.customToken,
);

module.exports = router;
