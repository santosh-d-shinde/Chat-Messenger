const express = require('express');
const router = express.Router();

const EmailVerification = require('../controllers/emailVerificationController.js');

router.post('/', EmailVerification.post);

module.exports = router;
