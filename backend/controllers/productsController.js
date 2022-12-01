const Product = require('../models/productModel')
const inValidRecordError = require('../utils/errorhandler')
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const ApiFeatures = require('../utils/apifeatures')

const productFunctions = {

    // Create Product -- Admin Route
    createProduct : asyncErrorHandler(async(req , res) => {
        const product = new Product(req.body)
        await product.save();

        res.status(201).json({
            success_message:"Data has been posted successfully",
            product : product
        })
    }),

    // Get All Products
    getAllProducts : asyncErrorHandler(async(req , res) => {
        const resultperpage = 5;
        const productCounter = await Product.countDocuments()

        const apiFeaturesObject = new ApiFeatures(Product.find() , req.query)
        .search()
        .filter()
        .pagination(resultperpage)
        
        const products = await apiFeaturesObject.queryProperty

        res.status(200).json({
            success_message : "Data has been fetched successfully" ,
            Counter : resultperpage + " from " + productCounter,
            products : products
        })
    }) ,

    getSingleProduct : asyncErrorHandler(async( req , res , next) => {
            let product = await Product.findById(req.params.id)

            if(!product){
                return next(new inValidRecordError("Product Not Found" , 404))
            }

            res.status(200).json({
                message : "Single Product Found" ,
                product
            })
    }),

    updateProduct : asyncErrorHandler(async(req , res , next) => {

        let product = await Product.findById(req.params.id)
        if(!product){
            return next(new inValidRecordError("Product not updated" , 500))
        }

        product = await Product.findByIdAndUpdate(req.params.id , req.body , {new:true , runValidators:true , useFindAndModify:false})

        res.status(200).json({
            success_message : "Product has been updated" ,
            product: product
        })
    }) ,

    deleteProduct : asyncErrorHandler(async(req , res , next) => {
        let product = await Product.findById(req.params.id)

        if(!product){
            return next(new inValidRecordError("Product Not Found and Deleted" , 500))
        }
        
        await product.remove()

        res.status(200).json({
            message_success : true , 
            message : "Product Deleted Successfully"
        })
    })
}

module.exports = productFunctions