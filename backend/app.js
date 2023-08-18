const express=require('express')
const cors = require('cors');
const app=express();
const cookieParser=require('cookie-parser')
const fileUpload = require("express-fileupload");
const dotenv=require('dotenv')
const {errorHandler}=require('./middleware/errorHandler')
const path=require('path')

app.use(express.json({limit:"10mb"}))
app.use(cookieParser())

    app.use(cors());
app.use(express.urlencoded({extended:true,limit:"10mb"}))
app.use(fileUpload())

//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({path:'backend/config/config.env'})

}
//Routes 
const product=require('./routes/productRoute')
const user=require('./routes/userRoute')
const order=require('./routes/orderRoute');
const payment=require('./routes/paymentRoute')
app.use('/api/v1',product)
app.use('/api/v1',user)
app.use('/api/v1',order)
app.use('/api/v1',payment)

// app.use(express.static(path.join(__dirname,"../frontend/build")))

// app.get("*",(req,res)=>{
//     res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
// })

//middleware
app.use(errorHandler) 

module.exports=app
