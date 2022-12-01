const express = require('express')
const router = express.Router()
const Users = require('../controllers/userController')

router.route('/register').post(Users.createUser)

router.route('/login').post(Users.loginUser)

module.exports = router