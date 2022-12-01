const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type:String , 
        required:[true , 'Please enter product name'] , 
        trim:true
    } ,
    description:{
        type:String,
        required:[true , "Please enter product description"]
    } ,
    price:{
        type:Number,
        required:true,
        maxLength:[7, "Price can't exceed from 7 characters"]
    },
    rating:{
        type:Number,
        default:0,
    },
    image:[
        {
            public_id : {type:String , required:true},
            url:{type:String , required:true}
        }
    ],
    category:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true,
        maxLength:[5 , "Stock can't exceed from 5 characters"] , 
        default : 1
    },
    numofReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name : {type : String , required : true} ,
            rating : {type : Number , required : true} ,
            comment : {type : String , required : true}
        }
    ],
    createdAt:{
        type : Date ,
        default: Date.now()
    }
})

module.exports = mongoose.model('My Products' , productSchema)