const express = require('express');
const mailControler = require('../controllers/mail.controller.js');
const validateParams = require('../middleware/ValidateParams.js').default;
const {
  sendVerificationCodeValidateSchema,
  verifyCodeSchema,
} = require('@validate/schema.js');

const router = express.Router();

router.post(
  '/send-verification-code',
  validateParams(sendVerificationCodeValidateSchema),
  mailControler.sendVerificationCode,
);
router.post(
  '/verify-code',
  validateParams(verifyCodeSchema),
  mailControler.verifyCode,
);

module.exports = router;
