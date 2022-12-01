const express = require('express')
const router = express.Router()
const product = require('../controllers/productsController')

router.route('/product/new').post(product.createProduct)
router.route('/products').get(product.getAllProducts)
router.route('/product/:id').get(product.getSingleProduct)
router.route('/product/:id').put(product.updateProduct)
router.route('/product/:id').delete(product.deleteProduct)

module.exports = router