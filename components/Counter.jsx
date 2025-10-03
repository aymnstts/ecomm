'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId, size }) => {
    const dispatch = useDispatch()
    const cartKey = `${productId}-${size}`
    const cartItem = useSelector(state => state.cart.cartItems[cartKey])
    const quantity = cartItem?.quantity || 0

    const handleIncrement = () => {
        if (cartItem) {
            dispatch(addToCart({ 
                productId, 
                size,
                price: cartItem.price,
                mrp: cartItem.mrp
            }))
        }
    }

    return (
        <div className="flex items-center gap-3">
            <button 
                onClick={() => dispatch(removeFromCart({ productId, size }))}
                className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-100 active:scale-95 transition"
            >
                -
            </button>
            <span className="w-8 text-center">{quantity}</span>
            <button 
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded hover:bg-slate-100 active:scale-95 transition"
            >
                +
            </button>
        </div>
    )
}

export default Counter