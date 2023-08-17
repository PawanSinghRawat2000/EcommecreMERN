import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  error:'',
  products: [],
  productCount: 0,
  resultPerPage: 0,
  filteredProductCount:0,
  adminProducts:[],
  isDeleted:false,
  success:false,
  product:{}
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers:{
    reset:(state)=>{
      state.isDeleted=false;
      state.error='';
      state.isError=false;
      state.success=false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state, action) => {
        state.isLoading = true;
        state.isError=false;
        state.error='';
      }).addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.filteredProductCount=action.payload.filteredProductCount;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading=false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(getAdminProducts.pending, (state, action) => {
        state.isLoading = true;
        state.isError=false;
        state.error='';
      }).addCase(getAdminProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.adminProducts=action.payload.products
        
      })
      .addCase(getAdminProducts.rejected, (state, action) => {
        state.isLoading=false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.isLoading = true;
        state.isError=false;
        state.error='';
        
      }).addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDeleted=true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading=false;
        state.isError = true;
        state.error = action.error.message;
      })
      .addCase(createProduct.pending, (state, action) => {
        state.isLoading = true;
        state.isError=false;
        state.error='';
        
      }).addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success=true;
        state.product=action.payload.product
        
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading=false;
        state.isError = true;
        state.error = action.payload;
        state.success=false;
      });
  },
});

//Fetching products from backend
export const fetchProducts = createAsyncThunk(
  "fetch/products",
  async (parameter)=> {
    try{
      const {keyword,currentPage,price,category,ratings}=parameter
      // console.log(currentPage)
      // console.log(keyword)
      // console.log(price)
      // console.log(category)
      // console.log(ratings)
      
      let url = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
       if(category)url = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${ratings}`;
    const response = await axios.get(url);
    // console.log(response.data)
    return response.data;
    }catch(error){
      throw error;
    }
  }
);

//Get all products-->ADMIN
export const getAdminProducts=createAsyncThunk(
  "admin/products",
  async()=>{
    const response=await axios.get(`/api/v1/admin/products`)
    return response.data;
  }
)

//Delete Product -->ADMIN
export const deleteProduct=createAsyncThunk(
  "admin/deleteProduct",
  async(id)=>{
    const response=await axios.delete(`/api/v1/admin/product/${id}`)
    return response.data;
  }
)

//create Product -->ADMIN
export const createProduct=createAsyncThunk(
  "admin/createProduct",
  async(formData)=>{
    //console.log(productData)
    const config={
      headers:{
        "Content-Type":"multipart/form-data"
      }
    }
    const response=await axios.post(`/api/v1/admin/product/new`,formData,config)
    return response.data;
  }
)


export const {reset}=productSlice.actions
export default productSlice.reducer;
