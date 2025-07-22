const express = require('express');
const customController = require('../controllers/custom.controller.js');
const validateParams = require('../middleware/ValidateParams.js').default;
const {logValidateSchema} = require('../validate/schema.js');

const router = express.Router();

router.post('/log', validateParams(logValidateSchema), customController.log);

router.get('/log', customController.getLog);

router.get('/export-csv', customController.exportLogCSV);

module.exports = router;
