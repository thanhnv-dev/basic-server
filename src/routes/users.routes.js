const express = require('express');
const usersController = require('../controllers/user.controller.js');
const validateParams = require('../middleware/ValidateParams.js').default;
const {
  signUpValidateSchema,
  refreshTokenValidateSchema,
  signInValidateSchema,
  profileValidateSchema,
  customTokenValidateSchema,
} = require('../validate/schema.js');
const JWToken = require('../middleware/JWToken.js');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const router = express.Router();

router.post(
  '/sign-up',
  validateParams(signUpValidateSchema),
  usersController.signUp,
);

router.post(
  '/refresh-token',
  validateParams(refreshTokenValidateSchema),
  usersController.refreshToken,
);

router.post(
  '/sign-in',
  validateParams(signInValidateSchema),
  usersController.signIn,
);

router.post(
  '/custom-token',
  validateParams(customTokenValidateSchema),
  usersController.customToken,
);

router.use(JWToken.verifyToken);

router.get('/profile', usersController.profile);

router.delete('/delete', usersController.deleteUser);
router.delete(
  '/update-infomation',
  validateParams(customTokenValidateSchema),
  usersController.updateInfomation,
);

router.use(upload.any());
router.patch('/update-image', usersController.updateImage);

module.exports = router;
