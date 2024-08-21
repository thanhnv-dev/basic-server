const express = require('express');
const notificationController = require('../controllers/notification.controller.js');
const {
  readNotiValidateSchema,
  notificationValidateSchema,
} = require('../validate/schema.js');
const validateParams = require('../middleware/ValidateParams.js').default;
const JWToken = require('../middleware/JWToken.js');
const router = express.Router();

router.use(JWToken.verifyToken);

router.patch(
  '/read',
  validateParams(readNotiValidateSchema),
  notificationController.readNoti,
);
router.get(
  '/',
  validateParams(notificationValidateSchema),
  notificationController.getNotis,
);

module.exports = router;
