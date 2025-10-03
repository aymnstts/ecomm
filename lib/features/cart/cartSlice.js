import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

let debounceTimer = null

export const uploadCart = createAsyncThunk('cart/uploadCart', 
    async ({ getToken }, thunkAPI) => {
        try {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(async ()=> {
                const { cartItems } = thunkAPI.getState().cart;
                const token = await getToken();
                await axios.post('/api/cart', {cart: cartItems}, { headers: { Authorization: `Bearer ${token}` } })
            },1000)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const fetchCart = createAsyncThunk('cart/fetchCart', 
    async ({ getToken }, thunkAPI) => {
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/cart', {headers: { Authorization: `Bearer ${token}` }})
            return data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)


const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {}, // Structure: { "productId-size": { quantity, size, price, mrp } }
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId, size, price, mrp } = action.payload
            const cartKey = `${productId}-${size}`
            
            if (state.cartItems[cartKey]) {
                state.cartItems[cartKey].quantity++
            } else {
                state.cartItems[cartKey] = {
                    productId,
                    size,
                    price,
                    mrp,
                    quantity: 1
                }
            }
            state.total += 1
        },
        removeFromCart: (state, action) => {
            const { productId, size } = action.payload
            const cartKey = `${productId}-${size}`
            
            if (state.cartItems[cartKey]) {
                state.cartItems[cartKey].quantity--
                if (state.cartItems[cartKey].quantity === 0) {
                    delete state.cartItems[cartKey]
                }
                state.total -= 1
            }
        },
        deleteItemFromCart: (state, action) => {
            const { productId, size } = action.payload
            const cartKey = `${productId}-${size}`
            
            if (state.cartItems[cartKey]) {
                state.total -= state.cartItems[cartKey].quantity
                delete state.cartItems[cartKey]
            }
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchCart.fulfilled, (state, action)=>{
            state.cartItems = action.payload.cart
            state.total = Object.values(action.payload.cart).reduce((acc, item)=> acc + item.quantity, 0)
        })
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export default cartSlice.reducer