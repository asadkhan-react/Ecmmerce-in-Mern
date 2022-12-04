const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema( {
    shippingInfo : {
        address : {type : String , required : true} ,
        city : {type : String , required : true} ,
        state : {type : String , required : true} ,
        country : {type : String , required : true} ,
        pinCode : {type : Number , required : true} ,
        phoneNo : {type : Number , required : true} ,
    } ,

    orderItems : [
        {
            name : {type : String , required : true} ,
            price : {type : Number , required : true} ,
            quantity : {type : Number , required : true} ,
            image : {type : String , required : true} ,
            product : {type : mongoose.Schema.ObjectId , ref : "Product" , required : true} ,
        }
    ] ,

    user : {
        type : mongoose.Schema.ObjectId , 
        ref : "User" , 
        required : true
    } ,

    paymentInfo : {
        id : {type : String , required : true} ,
        status : {type : String , requried : true}
    } ,

    paidAt : {
        type : Date ,
        required : true
    } ,

    itemsPrice : {
        type : Number ,
        default : 0
    } ,

    taxPrice : {
        type : Number ,
        default : 0
    } ,

    shippingPrice : {
        type : Number ,
        default : 0
    } ,

    totalPrice : {
        type : Number ,
        default : 0
    } ,

    orderStatus : {
        type : String ,
        required : true ,
        default : "processing"
    } ,
    
    createdAt : {
        type : Date ,
        default : Date.now()
    }
    ,
    delieverdAt : Date 

})

module.exports = mongoose.model("Orders" , orderSchema)