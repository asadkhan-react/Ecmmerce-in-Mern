const mongoose = require('mongoose')

const DB = () => { 
    mongoose.connect(process.env.DB_URI).then((data)=>{
        console.log(`MongoDB connected with Server: ${data.connection.host}`)
        // ${data.connection.host} is se humen pata chale ga k humari host kia he
    })
}

module.exports = DB