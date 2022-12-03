const express = require('express')
const router = express.Router()
const product = require('../controllers/productsController')
const auth = require('../middlewares/auth')

router.route('/admin/product/new').post(auth.isAuthenticate , auth.authenticateRole("admin") , product.createProduct)
router.route('/products').get(auth.isAuthenticate , product.getAllProducts)
router.route('/product/:id').get(auth.isAuthenticate , auth.authenticateRole("admin") , product.getSingleProduct)
router.route('/admin/product/:id').put(auth.isAuthenticate , auth.authenticateRole("admin") , product.updateProduct)
router.route('/admin/product/:id').delete(auth.isAuthenticate , auth.authenticateRole("admin") , product.deleteProduct)

module.exports = router