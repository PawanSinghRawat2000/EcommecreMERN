//Create Token and store in cookie
const sendToken=(user,statusCode,res)=>{
    const token=user.getJWTToken();
    console.log(token)
    //options for cookie
    const options={
        httpOnly:true, 
        expiresIn:Date.now()+5*24*60*60*1000,
        
    };
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        user,
        token
    })
}
module.exports=sendToken;