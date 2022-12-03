const Product = require('../models/productModel')
const responseError = require('../utils/errorhandler')
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const ApiFeatures = require('../utils/apifeatures')

const productFunctions = {

    // Create Product -- Admin Route
    createProduct : asyncErrorHandler(async(req , res) => {
        req.body.author = req.user.id
        
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

    // -- Admin Route
    getSingleProduct : asyncErrorHandler(async( req , res , next) => {
            let product = await Product.findById(req.params.id)

            if(!product){
                return next(new responseError("Product Not Found" , 404))
            }

            res.status(200).json({
                message : "Single Product Found" ,
                product
            })
    }),

    // -- Admin Route
    updateProduct : asyncErrorHandler(async(req , res , next) => {

        let product = await Product.findById(req.params.id)
        if(!product){
            return next(new responseError("Product not updated" , 500))
        }

        product = await Product.findByIdAndUpdate(req.params.id , req.body , {new:true , runValidators:true , useFindAndModify:false})

        res.status(200).json({
            success_message : "Product has been updated" ,
            product: product
        })
    }) ,

    // -- Admin Route
    deleteProduct : asyncErrorHandler(async(req , res , next) => {
        let product = await Product.findById(req.params.id)

        if(!product){
            return next(new responseError("Product Not Found and Deleted" , 500))
        }
        
        await product.remove()

        res.status(200).json({
            message_success : true , 
            message : "Product Deleted Successfully"
        })
    }) , 

    // Create New Review or Update the Review

    createProductReview : asyncErrorHandler(async(req , res , next) =>{
        const {rating , comment , productId} = req.body

        const review = {
            author : req.user._id,
            name : req.user.name,
            rating : Number(rating),
            comment
        }

        const product = await Product.findById(productId)

        if(!product){
            return next(new responseError("Product does not exist" , 404))
        }

        // Create Review
        product.reviews.push(review)

        // Number of Reviews
        product.numofReviews = product.reviews.length

        // Rating Average
        let avg = 0
        product.reviews.forEach((rev) => {
            avg = avg + rev.rating
        })
        product.ratingsAverage = avg / product.reviews.length

        // Save Document
        await product.save({validateBeforeSave : false})

        res.status(200).json({
            success_message : true ,
            product
        })
    }) , 

    // Get all the reviews of One Product
    getAllReviews : asyncErrorHandler(async(req , res , next) =>{

        const product = await Product.findById(req.query.productid)
        
        if(!product){
            return next(new responseError("Product does not exist" , 404))
        }

        res.status(200).json({
            success_message : true ,
            reviews : product.reviews
        })

    }) , 

    // Delete Review
    deleteReview : asyncErrorHandler(async(req , res , next) =>{

        const product = await Product.findById(req.query.productid)
        // mene req.query se product ki id le li

        if(!product){
            return next(new responseError("Product does not exist" , 404))
        }
        // product na milne per ye response aae ga,

        const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id)
        // yahan mene filter ka method istimal kia product k reviews k lie ,
        // yahan mene btaya k muje wo reviews dikhao , jin ki id req.query.id k equal na ho
        // ab mene jo b id di ho gi review ki ,  wo review chor ker baki sab reviews muje dikhen ge,
        // ab muje jaldi se is filter ko database me save ker dena he

        let avg = 0

        reviews.forEach((rev) => {
            avg = avg + rev.rating
            console.log(avg)
        })

        const ratingsAverage = avg / product.reviews.length

        const numofReviews = reviews.length

        await Product.findByIdAndUpdate(req.query.productid , {
            reviews ,
            ratingsAverage ,
            numofReviews
        },{
            new : true ,
            runValidators : true ,
            useFindAndModify : false
        })

        res.status(200).json({
            success_message : true ,
        })

    })

}

module.exports = productFunctions