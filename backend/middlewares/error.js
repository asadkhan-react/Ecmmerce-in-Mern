const Errorhandler = require('../utils/errorhandler')

module.exports = (err , req, res , next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if(err.name === "CastError"){
        err = new Errorhandler("Invalid Record ID" , 400)
    }

    res.status(err.statusCode).json({
        success: false,
        errorMessage : err.message ,
        errorCode : err.statusCode ,
    })
}