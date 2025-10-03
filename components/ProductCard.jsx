'use client'
import { StarIcon, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { toast } from 'react-hot-toast'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'MAD'
    const dispatch = useDispatch()

    // Get available sizes from the product.sizes object
    const availableSizes = Object.keys(product.sizes || {})
    const [selectedSize, setSelectedSize] = useState(availableSizes[0] || '')

    // Get pricing for selected size
    const selectedPricing = product.sizes?.[selectedSize] || { price: 0, mrp: 0 }

    // Calculate average rating
    const rating = product.rating?.length > 0 
        ? Math.round(product.rating.reduce((acc, curr) => acc + curr.rating, 0) / product.rating.length)
        : 0

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!selectedSize) {
            toast.error('Please select a size')
            return
        }

        dispatch(addToCart({
            productId: product.id,
            size: selectedSize,
            price: Number(selectedPricing.price),
            mrp: Number(selectedPricing.mrp)
        }))
        
        toast.success('Added to cart!')
    }

    return (
        <div className='group max-xl:mx-auto relative'>
            <Link href={`/product/${product.id}`}>
                <div className='bg-[#F5F5F5] h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center'>
                    <Image 
                        width={500} 
                        height={500} 
                        className='max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300' 
                        src={product.images[0]} 
                        alt={product.name} 
                    />
                </div>
            </Link>
            
            <div className='flex flex-col gap-2 text-sm text-slate-800 pt-2 max-w-60'>
                <Link href={`/product/${product.id}`}>
                    <div className='flex justify-between gap-3'>
                        <div>
                            <p>{product.name}</p>
                            <div className='flex'>
                                {Array(5).fill('').map((_, index) => (
                                    <StarIcon 
                                        key={index} 
                                        size={14} 
                                        className='text-transparent mt-0.5' 
                                        fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} 
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='font-semibold'>{currency}{selectedPricing.price}</p>
                            <p className='text-xs text-slate-500 line-through'>{currency}{selectedPricing.mrp}</p>
                        </div>
                    </div>
                </Link>

                {/* Size Selection */}
                <div className='flex items-center gap-2 mt-1'>
                    <select
                        value={selectedSize}
                        onChange={(e) => {
                            e.stopPropagation()
                            setSelectedSize(e.target.value)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className='flex-1 px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-slate-800'
                    >
                        {availableSizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    
                    <button
                        onClick={handleAddToCart}
                        className='px-3 py-1.5 bg-slate-800 text-white rounded hover:bg-slate-900 active:scale-95 transition flex items-center gap-1'
                    >
                        <ShoppingCart size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard