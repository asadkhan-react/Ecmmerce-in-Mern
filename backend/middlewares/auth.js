const asyncErrorHandler = require('../utils/asyncErrorHandler')
const responseError = require('../utils/errorhandler')
const jwt = require('jsonwebtoken')
const Users = require('../models/usersModel')
const apiErrorHandling = require('../utils/errorhandler')

const auth = {
    isAuthenticate : asyncErrorHandler(async (req , res , next) => {
        const token = req.cookies.token
    
        if(!token){
            return next(new responseError("Please Login" , 401 ))
        }
    
        const decodedData = jwt.verify(token , process.env.JWT_SECRET)
    
        req.user = await Users.findById(decodedData.id)
        // ab me req.user ko kahen bhi ,  or kisi bhi api me get ker skta hun.
    
        next()
    }) , 

    authenticateRole : (...roles) => {
        return (req ,res , next) =>{

            if(!roles.includes(req.user.role)){
               return next(new apiErrorHandling("This user role is not allowed to access" , 403))
            }

            next()
        }
    }
}

module.exports = auth


