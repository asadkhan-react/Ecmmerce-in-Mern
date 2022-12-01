const tokenAndCookie = (user , statusCode , response) => {
    const token = user.getJWTWEBTOKEN()

    const options = {
        expires : new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 60 * 1000
        ),
        httpOnly : true ,
    }

    response.status(statusCode).cookie("token" , token , options).json({
        message : "Success" ,
        token ,
        user
    })
}

module.exports = tokenAndCookie