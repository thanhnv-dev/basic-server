const express = require('express');
const mailControler = require('../controllers/mail.controller.js');

const router = express.Router();

router.post('/send', mailControler.sendMail);

module.exports = router;
