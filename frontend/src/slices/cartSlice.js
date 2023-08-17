import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem(state, action) {
            const item = action.payload;
            //console.log(item)
            const isItemExist = state.cartItems.find((i) => i.product === item.product);
            if (isItemExist) {
                state.cartItems = state.cartItems.map((i) =>
                    i.product === isItemExist.product ? item : i
                );
                //console.log("ITEM EXISTS")
            } else {
                state.cartItems.push(item);
            }

            // Update local storage with the new cart items
            localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
            //console.log("DONE")
        
        },
        removeItem(state,action){
            state.cartItems=state.cartItems.filter(i=>i.product!==action.payload)
            localStorage.setItem("cartItems",JSON.stringify(state.cartItems))
        },

    },
});

export const { addItem ,removeItem} = cartSlice.actions;
export default cartSlice.reducer;

//Add items to cart
export const addItemsToCart = createAsyncThunk(
    "cart/addItem",
    async ({ id, quantity }, { dispatch }) => {
        const { data } = await axios.get(`/api/v1/product/${id}`);
        //console.log(data)
        dispatch(
            addItem({
                product: data.product._id,
                name: data.product.name,
                image: data.product.images[0].url,
                stock: data.product.stock,
                price:data.product.price,
                quantity,
            })
        );
    
    }
);

