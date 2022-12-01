const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true , "Please enter your name"] ,
        maxLength : [30 , "Name Maximum length is 30 characters"] ,
        minLength: [4 , "Please enter your full name"]
    } ,
    email:{
        type : String ,
        required: [true , "Please enter your Email"] ,
        unique : true ,
        validate : [validator.isEmail , "Please enter valid email"]
    } ,
    password: {
        type : String,
        required: [true , "Please enter your password"] ,
        minLength: [8 , "Password should be equal or great than 8 characters"] ,
        select : false
    },
    avatar: {
        public_id: {
            type:String , required:true
        },
        url: {
            type:String , required:true
        }
    } ,
    role: {
        type : String,
        default : "user"
    } ,
    resetjsonwebtoken: String,
    expirejsonwebtoken: Date
})

// password encryption
userSchema.pre("save" , async function(){

    if(!this.isModified('password')){
        next()
    }

    this.password = await bcrypt.hash(this.password , 10)
})

// JWT TOKEN
userSchema.methods.getJWTWEBTOKEN = function(){
    return jwt.sign({id : this._id} , process.env.JWT_SECRET , {expiresIn:process.env.JWT_EXPIRE})
}

// compare Password
userSchema.methods.comparePassword = async function(passwordParameter){
    return await bcrypt.compare(passwordParameter , this.password)
}


module.exports = mongoose.model("Users" , userSchema)