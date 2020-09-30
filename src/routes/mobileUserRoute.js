const express = require('express');
const mobileUserController = require('../controllers/mobileUserController')

const router = express.Router();

router.route('/').post(mobileUserController.postData);

module.exports = router;