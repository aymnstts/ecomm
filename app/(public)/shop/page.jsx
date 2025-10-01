'use client'
import { Suspense, useState, useMemo } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon, SlidersHorizontal, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"

function ShopContent() {
    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()
    const products = useSelector(state => state.product.list)
    
    // Filter states
    const [showFilters, setShowFilters] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })
    const [sortBy, setSortBy] = useState('newest')

    // Get unique categories
    const categories = useMemo(() => {
        const cats = [...new Set(products.map(p => p.category))]
        return cats.filter(Boolean)
    }, [products])

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = search
            ? products.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase())
            )
            : [...products];

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

        return filtered
    }, [products, search, selectedCategory, priceRange, sortBy])

    // Reset filters
    const resetFilters = () => {
        setSelectedCategory('all')
        setPriceRange({ min: '', max: '' })
        setSortBy('newest')
    }

    // Check if filters are active
    const hasActiveFilters = selectedCategory !== 'all' || priceRange.min !== '' || priceRange.max !== '' || sortBy !== 'newest'

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center gap-4 flex-wrap my-6">
                    <h1 
                        onClick={() => router.push('/shop')} 
                        className="text-2xl text-slate-500 flex items-center gap-2 cursor-pointer"
                    >
                        {search && <MoveLeftIcon size={20} />} 
                        All <span className="text-slate-700 font-medium">Products</span>
                        <span className="text-sm text-slate-400 ml-2">
                            ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'})
                        </span>
                    </h1>

                    {/* Filter Toggle Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
                    >
                        <SlidersHorizontal size={18} />
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Min Price Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Min Price
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                                />
                            </div>

                            {/* Max Price Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Max Price
                                </label>
                                <input
                                    type="number"
                                    placeholder="999999"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                                />
                            </div>

                            {/* Sort By Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name">Name: A to Z</option>
                                </select>
                            </div>
                        </div>

                        {/* Reset Filters Button */}
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-slate-800 hover:text-slate-600 transition"
                            >
                                <X size={16} />
                                Reset Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <div className="w-full text-center py-12 text-gray-500">
                            <p className="text-lg">No products found matching your filters.</p>
                            {hasActiveFilters && (
                                <button
                                    onClick={resetFilters}
                                    className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function Shop() {
    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}