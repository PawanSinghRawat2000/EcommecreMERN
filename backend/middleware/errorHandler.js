const errorHandler = (err, req, res, next) => {
  //Wrong mongo db error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    res.status(400);
    err = new Error(message);
    
  }
  //mongoose duplicate key error
  if(err.code===11000){
    const message=`Duplicate ${Object.keys(err.keyValue)} Entered`
    res.status(400)
    err = new Error(message);
  }

  //Wrong jwt web token
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token Invalid,try again.`;
    res.status(400)
    err = new Error(message);
    
  }

  //JWT expire error
  //Wrong jwt web token
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token Expired,try again.`;
    res.status(400)
    err = new Error(message);
  }

  const statusCode = res.statusCode || 500;

  res.status(statusCode);

  res.json({
    message: err.message || "Internal server error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};
