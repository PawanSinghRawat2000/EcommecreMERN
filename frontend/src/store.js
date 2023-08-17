import {configureStore} from '@reduxjs/toolkit'
import ProductReducer from './slices/productSlice'
import ProductDetailsReducer from './slices/productDetailsSlice'
import userReducer from './slices/userSlice'
import ProfileReducer from './slices/profileSlice'
import CartReducer from './slices/cartSlice'
import ShippingInfoReducer from './slices/shippingInfoSlice'
import NewOrderReducer from './slices/orderSlice'
import AdminUserReducer from './slices/adminUserSlice'
import ProductReviewsReducer from './slices/productReviewSlice'



export const store=configureStore({
    reducer:{
        products:ProductReducer,
        productDetails:ProductDetailsReducer,
        user:userReducer,
        profile:ProfileReducer,
        cart:CartReducer,
        shippingInfo:ShippingInfoReducer,
        newOrder:NewOrderReducer,
        adminUsers:AdminUserReducer,
        productReviews:ProductReviewsReducer
    }
})