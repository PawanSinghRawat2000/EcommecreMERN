const asyncHandler= require('express-async-handler');
const jwt=require('jsonwebtoken')
const User=require('../models/userModel')

exports.isAuthenticatedUser=asyncHandler(async(req,res,next)=>{
    const {token}=req.cookies;
    //console.log(token);

    if(!token){
        res.status(401);
        return next(new Error("Please login to access resource"));
    }

    const decodedData=jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
    next();
})

exports.authorizeRoles= (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            res.status(403);
           return next(new Error(`Role: ${req.user.role} is not allow to access this resource`))
        }
        next();
    }
}