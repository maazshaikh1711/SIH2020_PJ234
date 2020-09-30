const express = require('express');
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const router = express.Router();

router.route('/signup').post(authController.signUp)
router.route('/login').post(authController.logIn)

//route mounting
router.route('/').get(userController.getAllUsers)

//not implemented this route yet
//router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser)

module.exports = router