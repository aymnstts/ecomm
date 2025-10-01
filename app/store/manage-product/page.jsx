'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"

export default function StoreManageProducts() {

    const { getToken } = useAuth()
    const { user } = useUser()

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'MAD'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [deleteConfirm, setDeleteConfirm] = useState(null)

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

    const deleteProduct = async (productId) => {
        try {
            const token = await getToken()
            const { data } = await axios.delete(`/api/store/product?productId=${productId}`, {headers: { Authorization: `Bearer ${token}` } })
            setProducts(prevProducts => prevProducts.filter(product => product.id !== productId))
            toast.success(data.message || "Product deleted successfully")
            setDeleteConfirm(null)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        }
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
            <table className="w-full max-w-4xl text-left  ring ring-slate-200  rounded overflow-hidden text-sm">
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3 hidden md:table-cell">Description</th>
                        <th className="px-4 py-3 hidden md:table-cell">MRP</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {products.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex gap-2 items-center">
                                    <Image width={40} height={40} className='p-1 shadow rounded cursor-pointer' src={product.images[0]} alt="" />
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{currency} {product.mrp.toLocaleString()}</td>
                            <td className="px-4 py-3">{currency} {product.price.toLocaleString()}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                        <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleStock(product.id), { loading: "Updating data..." })} checked={product.inStock} />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                    <button 
                                        onClick={() => setDeleteConfirm(product.id)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                        title="Delete product"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-800 mb-3">Delete Product</h2>
                        <p className="text-slate-600 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                        <div className="flex gap-3 justify-end">
                            <button 
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2 text-slate-700 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => toast.promise(deleteProduct(deleteConfirm), { loading: "Deleting product..." })}
                                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}