const express = require('express')
const router = express.Router()
const Users = require('../controllers/userController')
const auth = require('../middlewares/auth')

router.route('/register').post(Users.createUser)

router.route('/login').post(Users.loginUser)

router.route('/logout').post(Users.loggedOut)

router.route('/forgot').post(Users.forgot)

router.route('/reset/:token').put(Users.reset)

router.route('/singleuser').get(auth.isAuthenticate , Users.userDetails)

router.route('/updatepassword').put(auth.isAuthenticate , Users.updateUserPassword)

router.route('/updateprofile').put(auth.isAuthenticate , Users.updateProfile)

// Following for Admins

router
    .route('/admin/users')
    .get(auth.isAuthenticate , auth.authenticateRole("admin") , Users.getAllUsers)

router
    .route('/admin/user/:id')
    .get(auth.isAuthenticate , auth.authenticateRole("admin") , Users.getSignleUser)
    .put(auth.isAuthenticate , auth.authenticateRole("admin") , Users.updateUserRole)
    .delete(auth.isAuthenticate , auth.authenticateRole("admin") , Users.deleteUser)

module.exports = router