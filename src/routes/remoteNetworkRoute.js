const express = require('express');
const remoteNetworkController = require('../controllers/remoteNetworkController')

const router = express.Router();

router.route('/').post(remoteNetworkController.getDetails);

module.exports = router;