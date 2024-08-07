const express = require('express');
const usersController = require('../controllers/user.controller.js');
const validateParams = require('../middleware/ValidateParams.js').default;
const {customTokenValidateSchema} = require('../validate/schema.js');
const JWToken = require('../middleware/JWToken.js');
const multer = require('multer');
const router = express.Router();

router.use(JWToken.verifyToken);

router.get('/profile', usersController.profile);

router.delete('/delete', usersController.deleteUser);
router.delete(
  '/update-infomation',
  validateParams(customTokenValidateSchema),
  usersController.updateInfomation,
);

const upload = multer({storage: multer.memoryStorage()}).single('file');
router.patch('/update-image', (req, res) => {
  upload(req, res, function (err) {
    usersController.updateImage(req, res, err);
  });
});

module.exports = router;
