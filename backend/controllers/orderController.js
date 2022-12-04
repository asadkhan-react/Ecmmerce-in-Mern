const Order = require('../models/ordersModel');
const Product = require('../models/productModel');
const responseError = require('../utils/errorhandler')
const asyncErrorHandler = require('../utils/asyncErrorHandler')

const orderFunctions = {
    createOrder : asyncErrorHandler(async(req , res , next) => {
        const {
            shippingInfo,
            orderItems ,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = req.body

        const order = await Order.create({
            shippingInfo,
            orderItems ,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        })

        res.status(200).json({
            success : true ,
            order
        })
    }) ,

    // Get Single Order
    getSingleOrder : asyncErrorHandler(async(req , res , next) => {

        const order = await Order.findById(req.params.id).populate(
            "user" ,
            "name email"
        )

        res.status(200).json({
            success : true ,
            order
        })

    }) ,

    // get logged in user
    myOrders : asyncErrorHandler(async(req , res , next) => {

        const orders = await Order.find({user: req.user._id})

        res.status(200).json({
            success : true ,
            orders
        })

    }) ,

    // get logged in user -- Admin
    getAllOrders : asyncErrorHandler(async(req , res , next) => {

        const orders = await Order.find()

        let totalAmount = 0

        orders.forEach(parameter => {
            totalAmount = totalAmount + parameter.totalPrice
        })

        res.status(200).json({
            success : true ,
            totalAmount ,
            orders
        })

    }) ,

    // Update Order Status -- Admin
    updateOrderStatus : asyncErrorHandler(async(req , res , next) => {

        const order = await Order.findById(req.params.id)

        if(!order){
            return next(new responseError("Order does not found" , 404))
        }

        if(order.orderStatus === "Delivered"){
            return next(new responseError("You already delivered the order" , 404))
        }

        order.orderItems.forEach(async(parameter) => {
            await updateStock(parameter.product , parameter.quantity)
        }) 

        order.orderStatus = req.body.status

        if(order.orderStatus === "Delivered"){
            order.delieverdAt = Date.now()
        }

        await order.save({validateBeforeSave : false})

        res.status(200).json({
            success : true ,
        })

    }) ,

    // Delete Order
    deleteOrder : asyncErrorHandler(async(req , res , next) => {

        const order = await Order.findById(req.params.id)

        if(!order){
            return next(new responseError("Order does not found" , 404))
        }

        await order.remove()

        res.status(200).json({
            success : true
        })

    }) ,
} 



async function updateStock (id , quantity){
    const product = await Product.findById(id)

    product.stock = product.stock - quantity
    await product.save()
} 



module.exports = orderFunctions