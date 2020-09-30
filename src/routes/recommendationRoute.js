const express = require('express');
const recommendationController = require('../controllers/recommendationController')

const router = express.Router();

router.route('/').post(recommendationController.getRecommendation)


module.exports = router