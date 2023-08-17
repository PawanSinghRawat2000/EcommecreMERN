import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    reviews:[],
    isLoading:false,
    error:null,
    isDeleted:false,
}

const productReviewSlice=createSlice({
    name:"review",
    initialState,
    reducers:{
        reset:(state)=>{
            state.error=null;
            state.isLoading=false;
            state.isDeleted=false;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllReviews.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(getAllReviews.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.reviews=action.payload.reviews;
        })
        .addCase(getAllReviews.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload
        })
        .addCase(deleteReview.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(deleteReview.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isDeleted=true;
        })
        .addCase(deleteReview.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload
        })
        
    }
})

//get all reviews of a product
export const getAllReviews=createAsyncThunk(
    "admin/allReviews",
    async(id)=>{
        const response = await axios.get(`/api/v1/reviews?id=${id}`);
        return response.data;
    }
)
//Delete review
export const deleteReview=createAsyncThunk(
    "admin/deleteReview",
    async({id,productId})=>{
        const response = await axios.delete(`/api/v1/reviews?productId=${productId}&id=${id}`);
        return response.data;
    }
)


export const {reset} = productReviewSlice.actions
export default productReviewSlice.reducer