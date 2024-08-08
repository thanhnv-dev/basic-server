const express = require('express');
const usersController = require('../controllers/user.controller.js');
const validateParams = require('../middleware/ValidateParams.js').default;
const {
  updateInfomationValidateSchema,
  createDeliveryAddressValidateSchema,
  updateDeliveryAddressValidateSchema,
  deleteDeliveryAddressValidateSchema,
} = require('../validate/schema.js');
const JWToken = require('../middleware/JWToken.js');
const multer = require('multer');
const router = express.Router();

router.use(JWToken.verifyToken);

router.delete(
  '/delete-delivery-address',
  validateParams(deleteDeliveryAddressValidateSchema),
  usersController.deleteDeliveryAddress,
);
router.patch(
  '/update-delivery-address',
  validateParams(updateDeliveryAddressValidateSchema),
  usersController.updateDeliveryAddress,
);
router.post(
  '/add-delivery-address',
  validateParams(createDeliveryAddressValidateSchema),
  usersController.createDeliveryAddress,
);
router.get('/delivery-address', usersController.getDeliveryAddress);

router.get('/profile', usersController.profile);

router.delete('/delete', usersController.deleteUser);
router.patch(
  '/update-informations',
  validateParams(updateInfomationValidateSchema),
  usersController.updateInfomations,
);

const upload = multer({storage: multer.memoryStorage()}).single('file');
router.patch('/update-image', (req, res) => {
  upload(req, res, function (err) {
    usersController.updateImage(req, res, err);
  });
});

module.exports = router;
