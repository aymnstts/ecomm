'use client'
import React, { useState, useMemo } from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { SlidersHorizontal, X } from 'lucide-react'

const LatestProducts = ({ isShopPage = false }) => {
    const displayQuantity = 4
    const products = useSelector(state => state.product.list)
    const [showFilters, setShowFilters] = useState(true)
    
    // Filter states
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })
    const [sortBy, setSortBy] = useState('newest')

    // Get unique categories from products
    const categories = useMemo(() => {
        const cats = [...new Set(products.map(p => p.category))]
        return cats.filter(Boolean)
    }, [products])

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = [...products]

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory)
        }

        // Filter by price range
        if (priceRange.min !== '') {
            filtered = filtered.filter(p => p.price >= Number(priceRange.min))
        }
        if (priceRange.max !== '') {
            filtered = filtered.filter(p => p.price <= Number(priceRange.max))
        }

        // Sort products
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                break
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price)
                break
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price)
                break
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name))
                break
            default:
                break
        }

        // Limit to 4 products on homepage
        if (!isShopPage) {
            filtered = filtered.slice(0, displayQuantity)
        }

        return filtered
    }, [products, selectedCategory, priceRange, sortBy, isShopPage])

    // Reset all filters
    const resetFilters = () => {
        setSelectedCategory('all')
        setPriceRange({ min: '', max: '' })
        setSortBy('newest')
    }

    // Check if any filters are active
    const hasActiveFilters = selectedCategory !== 'all' || priceRange.min !== '' || priceRange.max !== '' || sortBy !== 'newest'

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <div className='flex justify-between items-start gap-4 flex-wrap'>
                <Title 
                    title='Latest Products' 
                    description={`Showing ${filteredProducts.length} of ${products.length} products`} 
                    href='/shop' 
                />
                
                {/* Filter Toggle Button - Only on shop page */}
                {isShopPage && (
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className='flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition'
                    >
                        <SlidersHorizontal size={18} />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                )}
            </div>

            {/* Filters Panel - Only on shop page */}
            {isShopPage && showFilters && (
                <div className='mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                        {/* Category Filter */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800'
                            >
                                <option value='all'>All Categories</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Min Price
                            </label>
                            <input
                                type='number'
                                placeholder='0'
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Max Price
                            </label>
                            <input
                                type='number'
                                placeholder='999999'
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800'
                            />
                        </div>

                        {/* Sort By Filter */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800'
                            >
                                <option value='newest'>Newest First</option>
                                <option value='price-low'>Price: Low to High</option>
                                <option value='price-high'>Price: High to Low</option>
                                <option value='name'>Name: A to Z</option>
                            </select>
                        </div>
                    </div>

                    {/* Reset Filters Button */}
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className='mt-4 flex items-center gap-2 px-4 py-2 text-sm text-slate-800 hover:text-slate-600 transition'
                        >
                            <X size={16} />
                            Reset Filters
                        </button>
                    )}
                </div>
            )}

            {/* Products Grid */}
            <div className='mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between'>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <ProductCard key={product.id || index} product={product} />
                    ))
                ) : (
                    <div className='w-full text-center py-12 text-gray-500'>
                        <p className='text-lg'>No products found matching your filters.</p>
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className='mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition'
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default LatestProducts