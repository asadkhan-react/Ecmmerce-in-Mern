const Users = require('../models/usersModel')
const apiErrorHandling = require('../utils/errorhandler')
const asyncErrorHandler = require('../utils/asyncErrorHandler')
const tokenCookieResponse = require('../utils/tokenAndCookie')

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
    })
}

module.exports = userFunctions