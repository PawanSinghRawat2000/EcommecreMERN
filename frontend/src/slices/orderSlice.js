import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  order: {},
  error: null,
  isLoading: false,
  orders:[],
  orderDetail:{},
  adminOrders:[],
  success:false,
  isDeleted:false,
  isUpdated:false
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers:{
    resetOrder:(state)=>{
        state.error=null;
        state.isLoading=false;
        state.success=false;
        state.isDeleted=false;
        state.isUpdated=false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error=action.payload;
      })
      .addCase(myOrders.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(myOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
      })
      .addCase(myOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error=action.payload;
      })
      .addCase(getOrderDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetail = action.payload.order;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error=action.payload;
      })
      .addCase(getAllOrders.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminOrders = action.payload.orders;
        state.success=true;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error=action.payload;
        state.success=false;
      })
      .addCase(deleteOrder.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDeleted=true;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error=action.payload;
        state.isDeleted=false;
      })
      .addCase(updateOrder.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isUpdated=true;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error=action.payload;
        state.isUpdated=false;
      })
  },
  },

);

export const {resetOrder}=orderSlice.actions;
export default orderSlice.reducer;

//create order
export const createOrder=createAsyncThunk(
    "order/create",
    async(order)=>{
        const config={
            headers:{
                "Content-Type":"application/json"
            }
        }
        const {data}=await axios.post("/api/v1/order/new",order,config);
        return data
    }
)

//My orders
export const myOrders=createAsyncThunk(
  "order/myOrders",
  async()=>{
    const response=await axios.get(`/api/v1/orders/me`)
    return response.data
  }
)
//Get Order Details
export const getOrderDetails=createAsyncThunk(
  "order/details",
  async(id)=>{
    const response=await axios.get(`/api/v1/order/${id}`)
    return response.data
  }
)
//Get All Orders
export const getAllOrders=createAsyncThunk(
  "order/AllOrders",
  async()=>{
    const response=await axios.get(`/api/v1/admin/orders`)
    return response.data
  }
)

//Delete Order
export const deleteOrder=createAsyncThunk(
  "order/deleteOrder",
  async(id)=>{
    const response=await axios.delete(`/api/v1/admin/order/${id}`)
    return response.data
  }
)
//Update Order
export const updateOrder=createAsyncThunk(
  "order/update",
  async({id,formData})=>{
      const config={
          headers:{
              "Content-Type":"application/json"
          }
      }
      const {data}=await axios.put(`/api/v1/admin/order/${id}`,formData,config);
      return data
  }
)