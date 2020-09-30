const express = require('express');
const complaintController = require('../controllers/complaintController')

const router = express.Router();

router.route('/').post(complaintController.postComplaint);

module.exports = router;