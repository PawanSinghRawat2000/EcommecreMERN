import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    users:[],
    isLoading:false,
    error:null,
    isDeleted:false,
    user:{},
    isUpdated:false,
}

const adminUserSlice=createSlice({
    name:"adminUser",
    initialState,
    reducers:{
        reset:(state)=>{
            state.error=null;
            state.isLoading=false;
            state.isDeleted=false;
            state.isUpdated=false;
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(getAllUsers.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(getAllUsers.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.users=action.payload.users;
        })
        .addCase(getAllUsers.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload
        })
        .addCase(deleteUser.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(deleteUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isDeleted=true;
        })
        .addCase(deleteUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload
        })
        .addCase(getUserDetails.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(getUserDetails.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.user=action.payload.user
        })
        .addCase(getUserDetails.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload
        })
        .addCase(updateUser.pending,(state,action)=>{
            state.isLoading=true;
        })
        .addCase(updateUser.fulfilled,(state,action)=>{
            state.isLoading=false;
            state.isUpdated=true;
        })
        .addCase(updateUser.rejected,(state,action)=>{
            state.isLoading=false;
            state.error=action.payload
        })
    }
})

export const getAllUsers=createAsyncThunk(
    "admin/AllUsers",
    async()=>{
        const response = await axios.get('/api/v1/admin/users');
        return response.data;
    }
)
export const deleteUser=createAsyncThunk(
    "admin/deleteUser",
    async(id)=>{
        const response = await axios.delete(`/api/v1/admin/user/${id}`);
        return response.data;
    }
)
//get user details
export const getUserDetails=createAsyncThunk(
    "admin/user",
    async(id)=>{
        const response = await axios.get(`/api/v1/admin/user/${id}`);
        return response.data;
    }
)
//update User
export const updateUser=createAsyncThunk(
    "admin/updateUser",
    async({id,userData})=>{
        const config={
            headers:{
                "Content-Type":"application/json"
            }
        }
        const response = await axios.put(`/api/v1/admin/user/${id}`,userData,config);
        return response.data;
    }
)

export const {reset} = adminUserSlice.actions
export default adminUserSlice.reducer