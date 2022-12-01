require('dotenv').config({path:"backend/config/config.env"})
const app = require('./app')
const DB = require('./config/database')
DB()

// uncaughtException Exception Error Handling
process.on("uncaughtException" , err=>{
    console.log(`Error : ${err.message}`)
    console.log("Server is Shutting Down due to uncaughtException")
    process.exit(1)
})

const server = app.listen(process.env.PORT , ()=>{
    console.log(`Server has started at ${process.env.PORT}`)
})

// unhandledRejection Error Handling
process.on("unhandledRejection" , err=>{
    console.log(`Error : ${err.message}`)
    console.log("Server is Shutting Down")
    server.close()
})