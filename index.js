const express = require('express')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware.js')
const connectDB = require('./config/db.js')
const colors = require('colors')
const port = process.env.PORT || 5000
const cors = require('cors')
const cloudinary = require('cloudinary').v2;
const multer = require('multer');


connectDB()

const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use("/api/profile", require("./routes/profileRoute.js"));
app.use('/api/users', require('./routes/userRoute.js'))
app.use('/api/upload', require('./routes/uploadRouter.js'))

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running fine on port ${port}`)
})