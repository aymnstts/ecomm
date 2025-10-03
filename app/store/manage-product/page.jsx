'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import { Trash2 } from "lucide-react"

export default function StoreManageProducts() {

    const { getToken } = useAuth()
    const { user } = useUser()

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'MAD'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)

    const fetchProducts = async () => {
        try {
             const token = await getToken()
             const { data } = await axios.get('/api/store/product', {headers: { Authorization: `Bearer ${token}` } })
             setProducts(data.products.sort((a, b)=> new Date(b.createdAt) - new Date(a.createdAt)))
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
        setLoading(false)
    }

    const toggleStock = async (productId) => {
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/store/stock-toggle',{ productId }, {headers: { Authorization: `Bearer ${token}` } })
            setProducts(prevProducts => prevProducts.map(product =>  product.id === productId ? {...product, inStock: !product.inStock} : product))

            toast.success(data.message)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const openDeleteConfirm = (product) => {
        setProductToDelete(product)
        setDeleteConfirmModal(true)
    }

    const confirmDelete = async () => {
        try {
            const token = await getToken()
            await axios.delete(`/api/store/product?productId=${productToDelete.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            setProducts(prev => prev.filter(product => product.id !== productToDelete.id))
            toast.success('Product deleted successfully!')
            setDeleteConfirmModal(false)
            setProductToDelete(null)
        } catch (error) {
            console.error('Delete error:', error)
            toast.error(error?.response?.data?.error || error.message)
        }
    }

    const cancelDelete = () => {
        setDeleteConfirmModal(false)
        setProductToDelete(null)
    }

    // Helper function to get price range from sizes
    const getPriceRange = (sizes) => {
        if (!sizes || typeof sizes !== 'object') return { minPrice: 0, maxPrice: 0, minMrp: 0, maxMrp: 0 }
        
        const prices = Object.values(sizes).map(s => Number(s.price))
        const mrps = Object.values(sizes).map(s => Number(s.mrp))
        
        return {
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            minMrp: Math.min(...mrps),
            maxMrp: Math.max(...mrps)
        }
    }

    // Helper function to format price display
    const formatPriceDisplay = (min, max) => {
        if (min === max) {
            return `${currency} ${min.toLocaleString()}`
        }
        return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`
    }

    useEffect(() => {
        if(user){
            fetchProducts()
        }  
    }, [user])

    if (loading) return <Loading />

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Manage <span className="text-slate-800 font-medium">Products</span></h1>
            <table className="w-full max-w-5xl text-left ring ring-slate-200 rounded overflow-hidden text-sm">
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3 hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3 hidden lg:table-cell">Sizes</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {products.map((product) => {
                        const { minPrice, maxPrice, minMrp, maxMrp } = getPriceRange(product.sizes)
                        const sizeCount = Object.keys(product.sizes || {}).length
                        
                        return (
                            <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 items-center">
                                        <Image width={40} height={40} className='p-1 shadow rounded cursor-pointer' src={product.images[0]} alt="" />
                                        <span className="max-w-32 truncate">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 max-w-xs text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                                <td className="px-4 py-3 hidden md:table-cell">{formatPriceDisplay(minMrp, maxMrp)}</td>
                                <td className="px-4 py-3">{formatPriceDisplay(minPrice, maxPrice)}</td>
                                <td className="px-4 py-3 hidden lg:table-cell">
                                    <span className="px-2 py-1 rounded text-xs">
                                        {sizeCount} {sizeCount === 1 ? 'size' : 'sizes'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                        <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleStock(product.id), { loading: "Updating..." })} checked={product.inStock} />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        onClick={() => openDeleteConfirm(product)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Delete Product"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>

            {/* Delete Confirmation Modal */}
            {deleteConfirmModal && productToDelete && (
                <div onClick={cancelDelete} className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 className="text-red-600" size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                                <p className="text-sm text-gray-500">{productToDelete.name}</p>
                            </div>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this product? This action cannot be undone and all product data will be permanently removed.
                        </p>
                        
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Delete Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}