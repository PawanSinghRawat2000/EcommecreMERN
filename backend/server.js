const app=require('./app')
const cloudinary=require('cloudinary')
const connectDatabase=require('./config/database')


//Handling uncaught exception
process.on('uncaughtException',(err)=>{
    console.log(`Error: ${err.message} `)
    console.log("Shutting down the server due to uncaught Exception")
    process.exit(1)
})


//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require("dotenv").config({path:'backend/config/config.env'})

}

//connecting to database
connectDatabase()

cloudinary.config({
    cloud_name: "dxzzmcb1i",
    api_key: "436285414163821",
    api_secret: "e_8m0RtmpVvmU7LtK-y9WIStwqo",
    
  });

const server= app.listen(process.env.PORT,()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})



//unhandled Promise Rejection
process.on('unhandledRejection',err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to unhandled Promise rejection`)
    server.close(()=>{
        process.exit(1)
    })
})