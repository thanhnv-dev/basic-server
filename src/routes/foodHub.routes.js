const express = require('express');
const foodHubControler = require('../controllers/foodHub.controller.js');
const JWToken = require('../middleware/JWToken.js');
const validateParams = require('../middleware/ValidateParams.js').default;
const {profileValidateSchema} = require('../validate/schema.js');

const router = express.Router();

router.use(JWToken.verifyToken);

router.get('/categories', foodHubControler.categories);
router.get('/restaurants', foodHubControler.restaurents);
router.get(
  '/restaurant',
  validateParams(profileValidateSchema),
  foodHubControler.restaurent,
);
router.get(
  '/dish',
  validateParams(profileValidateSchema),
  foodHubControler.dish,
);

module.exports = router;
