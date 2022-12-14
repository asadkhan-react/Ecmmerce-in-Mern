const Users = require('../models/usersModel')
const apiErrorHandling = require('../utils/errorhandler')
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const tokenCookieResponse = require('../utils/tokenAndCookie')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

const userFunctions = {
    createUser : asyncErrorHandler(async(req , res) => {
        const {name , email , password} = req.body

        const user = new Users({
            name ,
            email , 
            password ,
            avatar : {public_id : "This is Sample Public Id" , url:"https://www.google.com"}
        }) 

        await user.save()

        tokenCookieResponse(user , 200 , res)
    }) ,

    loginUser : asyncErrorHandler(async(req , res , next) => {
        const {email , password} = req.body
        
        // checking if we get email and password
        if(!email || !password){
            return next(new apiErrorHandling("Please Enter Email & Password" , 400))
        }

        const user = await Users.findOne({email}).select("+password");

        if(!user){
            return next(new apiErrorHandling("Email or Password is wrong" , 401))
        }

        const matchPassword = await user.comparePassword(password)

        if(!matchPassword){
            return next(new apiErrorHandling("Email or Password is Wrong" , 401))
        }

        tokenCookieResponse(user , 200 , res)

    }) ,

    loggedOut : asyncErrorHandler(async(req , res , next) => {
        
        res.cookie("token" , null , {
            expires: new Date(Date.now()) ,
            httpOnly: true
        })

        res.status(200).json({
            message: "Logged Out Successfully"
        })
    }) ,

    forgot : asyncErrorHandler(async (req , res , next) => {
        
        const user = await Users.findOne({email : req.body.email})

        if(!user){
            return next(new apiErrorHandling("User not found" , 404))
        }

        const resetToken = user.getResetPasswordToken()
        
        console.log("Forgot Token 2")
        console.log(resetToken)

        await user.save({ validateBeforeSave : false })

        const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/reset/${resetToken}`

        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n if you did not requested this url , then , please ignore it.`
        
        try {
            await sendEmail({
                email : user.email ,
                subject : "Ecommerce Password Reset" ,
                message
            })

            res.status(200).json({
                success : true ,
                message : `Email sent to ${user.email}`
            })
        } catch (error){
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save( {validateBeforeSave : false} )
            
            return next(new apiErrorHandling(error.message , 500))
        }
    }) ,

    reset : asyncErrorHandler(async (req , res , next) => {
           
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

        const user = await Users.findOne({
            resetPasswordToken , 
            resetPasswordExpire : {$gt : Date.now() }
        })

        if(!user){
            return next(new apiErrorHandling("Token has been expired" , 400))
        }

        if(req.body.password !== req.body.confirmPassword){
            return next(new apiErrorHandling("Password does not match" , 400))
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save()
        
        tokenCookieResponse(user , 200 , res)
    }) ,

    userDetails : asyncErrorHandler(async(req , res , next) => {

        const user = await Users.findById(req.user.id)

        res.status(200).json({
            message : true ,
            user
        })

    }) ,

    updateUserPassword : asyncErrorHandler(async(req , res , next) => {
        
        const user = await Users.findById(req.user.id).select("+password")

        const matchPassword = await user.comparePassword(req.body.oldPassword)

        if(!matchPassword){
            return next(new apiErrorHandling("Old Password is incorrect" , 400))
        }

        if(req.body.newPassword !== req.body.confirmPassword){
            return next(new apiErrorHandling("Password does not match" , 400))
        }

        user.password = req.body.newPassword
        
        await user.save()

        tokenCookieResponse(user , 200 , res)
    }) ,

    updateProfile : asyncErrorHandler(async(req , res , next) => {
        
        const newUserData = {
            name : req.body.name ,
            email : req.body.email
        }

        const user = await Users.findByIdAndUpdate(req.user.id , newUserData , {
            new : true ,
            runValidators : true ,
            useFindAndModify : false
        })

        res.status(200).json({
            success : true , 
            user
        })

    }) ,

    // for Admin
    getAllUsers : asyncErrorHandler(async(req , res , next)=>{

        const users = await Users.find()

        res.status(200).json({
            success : true ,
            users
        })
    }) , 

    // for Admin
    getSignleUser : asyncErrorHandler(async(req , res , next)=>{

        const user = await Users.findById(req.params.id)

        if(!user){
            return next(new apiErrorHandling(`User does not exist with ${req.params.id}`))
        }

        res.status(200).json({
            success : true ,
            user
        })
    }) ,

    // for Admin
    updateUserRole : asyncErrorHandler(async(req , res , next) => {
        
        const newUserData = {
            name : req.body.name ,
            email : req.body.email ,
            role : req.body.role
        }

        const user = await Users.findByIdAndUpdate(req.params.id , newUserData , {
            new : true ,
            runValidators : true ,
            useFindAndModify : false
        })

        if(!user){
            return next(new apiErrorHandling(`User Doest not Exist with this ${req.params.id}` , 400))
        }

        res.status(200).json({
            success : true , 
        })

    }) ,

    // for Admin
   deleteUser : asyncErrorHandler(async(req , res , next) => { 
        
        const user = await Users.findById(req.params.id)

        if(!user){
            return next(new apiErrorHandling(`User Doest not Exist with this ${req.params.id}` , 400))
        }

        await user.remove()

        res.status(200).json({
            success : true , 
        })

    }) ,
}

module.exports = userFunctions