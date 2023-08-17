const Order=require('../models/orderModel');
const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");


//Create new order
exports.createOrder=asyncHandler(async(req,res)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    }=req.body
    const order= await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id,
    });

    res.status(201).json({
        success:true,
        message:"order created successfully",
        order
    })
    
})

//Get Single Order Detail
exports.getOrderDetails=asyncHandler(async(req,res)=>{
    const order=await Order.findById(req.params.id).populate("user","name email")
    if(!order){
        res.status(404)
        throw new Error('Order not Found')
    }
    res.status(200).json({
        success:true,
        order
    })
})

//Get logged-in User Orders
exports.myOrders=asyncHandler(async(req,res)=>{
    const orders=await Order.find({user:req.user._id});

    res.status(200).json({
        success:true,
        orders
    })
})

//Get All Orders --->Admin
exports.getAllOrders=asyncHandler(async(req,res)=>{
    const orders=await Order.find();

    let totalAmount=orders.reduce((acc,order)=>acc+order.totalPrice,0)

    res.status(200).json({
        success:true,
        totalAmount,
        orders
        
    })
})

//Update Order Status --->Admin
exports.updateOrder=asyncHandler(async(req,res)=>{
    const order=await Order.findById(req.params.id);

    if(!order){
        res.status(404)
        throw new Error('Order not Found')
    }

    if(order.orderStatus==="Delivered"){
        res.status(400)
        throw new Error("You have already delivered this product")
    }

    if(req.body.status==="Shipped"){
        order.orderItems.forEach(async (ord)=>{
            await updateStock(ord.product,ord.quantity);
        })
    }

    
    order.orderStatus=req.body.status;
    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now()
    }
    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
        
    })
})

async function updateStock(id,quantity){
    const product=await Product.findById(id)

    product.stock-=quantity;
    await product.save({validateBeforeSave:false})
}

//Delete Order --->Admin
exports.deleteOrder=asyncHandler(async(req,res)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        res.status(404)
        throw new Error('Order not Found')
    }

    await order.deleteOne()
    res.status(200).json({
        success:true
    })
    
        
    
})