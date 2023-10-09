const express = require('express');
const usersController = require('../controllers/user.controller.js');
const validateParams = require('@middleware/ValidateParams.js').default;
const {signUpValidateSchema} = require('@validate/schema.js');

const router = express.Router();

router.post(
  '/sign-up',
  validateParams(signUpValidateSchema),
  usersController.signUp,
);

router.post('/signup-with-email', usersController.signUpWithEmail);
router.get('/profile', usersController.profile);
router.post('/update-avatar', usersController.updateAvatar);
router.post('/update-informations', usersController.updateInformations);

module.exports = router;
