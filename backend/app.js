const express = require('express');
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser')
const app = express()

app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/v1' , require('./routes/productRoutes'))
app.use('/api/v1' , require('./routes/userRoutes'))
app.use('/api/v1' , require('./routes/orderRoutes'))

// Middleware for Error
app.use(errorMiddleware)

module.exports = app