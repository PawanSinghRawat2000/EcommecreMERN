import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  isAuthenticated: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser: (state) => {
      state.user = null;
      state.isAuthenticated = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.isLoading = true;
        state.error=null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isLoading = false;
      })

      .addCase(logout.pending, (state, action) => {
        state.isLoading = true;
        state.error=null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user=null;
        state.isAuthenticated = null;
        state.isLoading = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
  },
});

//Login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    // console.log(email);
    // console.log(password);

    const url = `/api/v1/login`;
    const config = { headers: { "Content-Type": "application/json" } };
    const response = await axios.post(url, {email,password}, config);
    if (response.status === 401) return thunkAPI.rejectWithValue(response); // Use rejectWithValue to dispatch rejection

    return response.data; // Return the response data on success
  }
);
//Register
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    const body = {
      name: userData.get("name"),
      email: userData.get("email"),
      password: userData.get("password"),
      avatar: userData.get("avatar"),
    };
    //console.log(body);
    const url = `/api/v1/register`;

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const response = await axios.post(url, body, config);
    if (response.status === 401) return thunkAPI.rejectWithValue(response); // Use rejectWithValue to dispatch rejection

    return response.data; // Return the response data on success
  }
);

//Load user
export const loadUser = createAsyncThunk("auth/load", async (_, thunkAPI) => {
  const url = `/api/v1/me`;

  const response = await axios.get(url);
  if (response.status === 401) return thunkAPI.rejectWithValue(response); // Use rejectWithValue to dispatch rejection

  return response.data; // Return the response data on success
});

//Logout user
export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  const url = `/api/v1/logout`;

  const response = await axios.get(url);
  if (response.status === 401) return thunkAPI.rejectWithValue(response); // Use rejectWithValue to dispatch rejection

  return response.data; // Return the response data on success
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
