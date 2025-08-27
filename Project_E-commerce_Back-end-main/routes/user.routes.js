const express = require('express');
const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken');
const allowTo = require('../middlewares/allowedTo');

const router = express.Router()
router.route('/')
        .get(verifyToken, userController.getAllUsers)

router.route('/register')
        .post(userController.register)

router.route('/login')
        .post(userController.login)

        module.exports = router