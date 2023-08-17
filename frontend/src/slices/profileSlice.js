import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  isAuthenticated: false,
  isUpdated:false,
  error:null,
  message:null,
  success:null,
};

const ProfileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    reset:(state)=>{ 
      state.isLoading=false;
      state.isUpdated=false;
      state.error=null;
      state.message=null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfile.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isAuthenticated=true;
        state.isUpdated=action.payload
      })
      .addCase(updateProfile.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload
      })
      .addCase(updatePassword.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updatePassword.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.isAuthenticated=true;
        state.isUpdated=action.payload
      })
      .addCase(updatePassword.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload
      })
      .addCase(forgotPassword.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.message=action.payload.message;
        state.error=null
      })
      .addCase(forgotPassword.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload
      })
      .addCase(resetPassword.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled,(state,action)=>{
        state.isLoading=false;
        state.success=action.payload;
      })
      .addCase(resetPassword.rejected,(state,action)=>{
        state.isLoading=false;
        state.error=action.payload
      })
  },
});


//update Profile
export const updateProfile = createAsyncThunk(
    "user/updateProfile",
    async (userData, thunkAPI) => {
      const body = {
        name: userData.get("name"),
        email: userData.get("email"),
        password: userData.get("password"),
        avatar: userData.get("avatar"),
      };
      //console.log(body);
      const url = `/api/v1/me/update`;
  
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const response = await axios.put(url, body, config);
      if (response.status !== 200) return thunkAPI.rejectWithValue(response); // Use rejectWithValue to dispatch rejection
      else return response.data.success; // Return the response data on success
    }
  );


  //update Password
export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (userData, thunkAPI) => {
    
    const passwords={
      oldPassword:userData.get('oldPassword'),
      newPassword:userData.get('newPassword'),
      confirmPassword:userData.get('confirmPassword'),
    }

    const url = `/api/v1/password/update`;

    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.put(url, passwords, config);
    if (response.status !== 200) return thunkAPI.rejectWithValue(response); // Use rejectWithValue to dispatch rejection

    return response.data.success; // Return the response data on success
  }
);

//Forgot Password
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, thunkAPI) => {

    const url = `/api/v1/password/forgot`;
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.post(url, email, config);
    if (response.status !==200) return thunkAPI.rejectWithValue(response); // Use rejectWithValue to dispatch rejection

    return response.data; // Return the response data on success
  }
);

//reset password
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (data, thunkAPI) => {
    
    const token=data.get('token');
    const passwords={
      password:data.get('password'),
      confirmPassword:data.get('confirmPassword'),
    }

    const url = `/api/v1/password/reset/${token}`;

    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.put(url, passwords, config);
    if (response.status !== 200) return thunkAPI.rejectWithValue(response); // Use rejectWithValue to dispatch rejection

    return response.data; // Return the response data on success
  }
);


export const {reset}=ProfileSlice.actions
  export default ProfileSlice.reducer
