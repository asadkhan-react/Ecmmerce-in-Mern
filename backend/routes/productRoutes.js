const express = require('express')
const router = express.Router()
const product = require('../controllers/productsController')
const auth = require('../middlewares/auth')

router.route('/products').get(product.getAllProducts)

router.route('/admin/product/new').post(auth.isAuthenticate , auth.authenticateRole("admin") , product.createProduct)

router
.route('/admin/product/:id')
.put(auth.isAuthenticate , auth.authenticateRole("admin") , product.updateProduct)
.delete(auth.isAuthenticate , auth.authenticateRole("admin") , product.deleteProduct)

router.route('/admin/product/:id').get(product.getSingleProduct)


// Reviews
// Create and Update Review of Product
router.route('/review').put(auth.isAuthenticate , product.createProductReview)
// Get or Delete Reviews of Product
router.route('/reviews').get(product.getAllReviews).delete(auth.isAuthenticate , product.deleteReview)


module.exports = router