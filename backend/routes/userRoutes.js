const express = require('express')
const router = express.Router()
const Users = require('../controllers/userController')

router.route('/register').post(Users.createUser)

router.route('/login').post(Users.loginUser)

router.route('/logout').post(Users.loggedOut)

router.route('/forgot').post(Users.forgot)

router.route('/reset/:token').put(Users.reset)

module.exports = router