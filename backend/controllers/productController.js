const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

//Create product-->Admin
exports.createProduct = asyncHandler(async (req, res) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else images = req.body.images;

  const imagesLink = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLink.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images = imagesLink;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// GET ALL PRODUCTS
exports.getAllProducts = asyncHandler(async (req, res) => {
  const resultPerPage = 8;

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  let filteredProductCount = products.length;
  apiFeature.pagination(resultPerPage);
  products = await apiFeature.query.clone();
  const productCount = await Product.countDocuments();

  res.status(201).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductCount,
  });
});

// GET ALL PRODUCTS-->ADMIN
exports.getAdminProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();

  res.status(201).json({
    success: true,
    products,
  });
});

//Update Products
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(500);
    throw new Error("Product not Found");
  }

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else images = req.body.images;

  if (images !== undefined) {
    //DELETE IMAGE FROM CLOUDINARY TOO
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLink = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imagesLink.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
    req.body.images = imagesLink;
    req.body.user = req.user.id;
  }
  
  const updatedValue = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json({
    success: true,
    updatedValue,
  });
});

//Delete Product
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500);
    throw new Error("Product not Found");
  }
  //DELETE IMAGE FROM CLOUDINARY TOO
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  product.deleteOne();
  res.status(200).json({
    message: "deleted",
  });
});
//Get Product Details
exports.getProductDetails = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(500);
    throw new Error("Product not Found");
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//Create New Review or update review
exports.createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
  }
  product.numOfReviews = product.reviews.length;
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;
  await product.save({
    validateBeforeSave: false,
  });
  res.status(200).json({
    success: true,
  });
});

//Get all reviews of a single product
exports.getProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    res.status(500);
    throw new Error("Product not Found");
  }

  res.status(201).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete review
exports.deleteProductReviews = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    res.status(500);
    throw new Error("Product not Found");
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;
  let avg = 0;
  reviews.forEach((rev) => (avg += rev.rating));

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      numOfReviews,
      ratings,
    },
    {
      new: true,
      runValidators: false,
      useFindAndModify: false,
    }
  );

  res.status(201).json({
    success: true,
    message: "Review deleted successfully",
  });
});
