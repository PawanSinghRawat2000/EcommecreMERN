import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    shippingInfo:JSON.parse(localStorage.getItem("shippingInfo")) || {}
};

const shippingInfoSlice = createSlice({
    name: "shipping",
    initialState,
    reducers: {
        saveShippingInfo(state,action){
            state.shippingInfo=action.payload;
            localStorage.setItem("shippingInfo",JSON.stringify(state.shippingInfo))
        }

    },
});

export const {saveShippingInfo}=shippingInfoSlice.actions
export default shippingInfoSlice.reducer
