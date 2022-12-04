const express = require('express')
const router = express.Router()
const order = require('../controllers/orderController')
const auth = require('../middlewares/auth')

router.route('/order/new').post(auth.isAuthenticate , order.createOrder)

router.route('/order/:id').get(auth.isAuthenticate , order.getSingleOrder)

router.route('/orders/me').get(auth.isAuthenticate , order.myOrders)

router.route('/admin/orders').get(auth.isAuthenticate , auth.authenticateRole('admin') , order.getAllOrders)

router.route('/admin/order/:id')
.put(auth.isAuthenticate , auth.authenticateRole('admin') , order.updateOrderStatus)
.delete(auth.isAuthenticate , auth.authenticateRole('admin') , order.deleteOrder)

module.exports = router