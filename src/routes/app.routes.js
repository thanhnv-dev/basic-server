const express = require('express');
const appControler = require('../controllers/app.controller.js');
const JWToken = require('../middleware/JWToken.js');
const validateParams = require('../middleware/ValidateParams.js').default;
const {profileValidateSchema} = require('../validate/schema.js');

const router = express.Router();

router.use(JWToken.verifyToken);

router.get('/categories', appControler.categories);
router.get('/restaurants', appControler.restaurents);
router.get(
  '/restaurant',
  validateParams(profileValidateSchema),
  appControler.restaurent,
);
router.get(
  '/dish',
  validateParams(profileValidateSchema),
  appControler.dish,
);

module.exports = router;
