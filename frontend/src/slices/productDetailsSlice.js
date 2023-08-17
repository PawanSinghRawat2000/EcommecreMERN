import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState = {
  isLoading:false,
  isError:false,
  error:"",
  product:{},
  success:false,
};

const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState,
  reducers:{
    reset:(state)=>{
      state.success=false;
      state.error=''
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductDetails.pending, (state, action) => {
        state.isLoading=true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.isLoading=false;
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.isError=true;
        state.error=action.payload;
      })
      .addCase(addProductReview.pending, (state, action) => {
        state.isLoading=true;
      })
      .addCase(addProductReview.fulfilled, (state, action) => {
        state.isLoading=false;
        state.success=action.payload
      })
      .addCase(addProductReview.rejected, (state, action) => {
        state.isError=true;
        state.success=false;
        state.error=action.payload;
      })
      .addCase(updateProductDetails.pending, (state, action) => {
        state.isLoading=true;
      })
      .addCase(updateProductDetails.fulfilled, (state, action) => {
        state.isLoading=false;
        state.success=action.payload
      })
      .addCase(updateProductDetails.rejected, (state, action) => {
        state.isError=true;
        state.success=false;
        state.error=action.payload;
      });
  },
});

//Fetching single product from backend
export const getProductDetails = createAsyncThunk("fetch/prodcuts", async (id) => {
    try{
        
        const response = await axios.get(`/api/v1/product/${id}`)
    return response.data;  
    }catch(error){
       return (error.response)?error.response.data.message:error.message;
    }
  
});

//Add Product Review
export const addProductReview = createAsyncThunk("addReview", async (data) => {
  try{
      const config={
        headers:{
          "Content-Type":"application/json"
        }
      }
      const response = await axios.put(`/api/v1/review`,data,config)
  return response.data.success;  
  }catch(error){
     return (error.response)?error.response.data.message:error.message;
  }

});
//Update Product Details
export const updateProductDetails = createAsyncThunk("update/product", async ({id,formData}) => {
  try{
      const config={
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
      
      const response = await axios.put(`/api/v1/admin/product/${id}`,formData,config)
  return response.data;  
  }catch(error){
     return (error.response)?error.response.data.message:error.message;
  }

});


export const {reset}=productDetailsSlice.actions;
export default productDetailsSlice.reducer;
