const express = require('express');
const mailControler = require('../controllers/mail.controller.js');
const validateParams = require('../middleware/ValidateParams.js').default;
const JWToken = require('../middleware/JWToken.js');
const {
  sendVerificationCodeValidateSchema,
  verifyCodeSchema,
} = require('../validate/schema.js');

const router = express.Router();

router.use(JWToken.verifyToken);
router.get(
  '/categories',
  validateParams(sendVerificationCodeValidateSchema),
  mailControler.sendVerificationCode,
);
router.post(
  '/verify-code',
  validateParams(verifyCodeSchema),
  mailControler.verifyCode,
);

module.exports = router;
