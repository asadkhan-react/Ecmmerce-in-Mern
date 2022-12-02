const Errorhandler = require('../utils/errorhandler')

module.exports = (err , req, res , next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Cast Error
    if(err.name === "CastError"){
        err = new Errorhandler("Invalid Record ID" , 400)
    }

    // Mongoose Duplicate Error
    if(err.code === 11000){
        err = new Errorhandler(`Duplicate ${Object.keys(err.keyValue)} Entered` , 400)
    }

    // JWT Error
    if(err.name === "JsonWebTokenError"){
        err = new Errorhandler(`Json Web Token is invalid` , 400)
    }

    // JWT Expire Error
    if(err.name === "TokenExpiredError"){
        err = new Errorhandler(`Json Web Token is Expired` , 400)
    }

    res.status(err.statusCode).json({
        success: false,
        errorMessage : err.message ,
        errorCode : err.statusCode ,
        errorStack : err.stack ,
    })
}