const express=require('express')
const cors = require('cors');
const app=express();
const cookieParser=require('cookie-parser')
const fileUpload = require("express-fileupload");
const dotenv=require('dotenv')
const {errorHandler}=require('./middleware/errorHandler')


app.use(express.json({limit:"10mb"}))
app.use(cookieParser())
const corsOptions ={
    origin:'http://localhost:3000',
    'Content-Type': 'Authorization',
    credentials:true,
    optionSuccessStatus:200
    }
    app.use(cors(corsOptions));
app.use(express.urlencoded({extended:true,limit:"10mb"}))
app.use(fileUpload())

//config
dotenv.config({path:'backend/config/config.env'})

//Routes 
const product=require('./routes/productRoute')
const user=require('./routes/userRoute')
const order=require('./routes/orderRoute');
const payment=require('./routes/paymentRoute')
app.use('/api/v1',product)
app.use('/api/v1',user)
app.use('/api/v1',order)
app.use('/api/v1',payment)

//middleware
app.use(errorHandler) 

module.exports=app
