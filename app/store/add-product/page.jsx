'use client'
import { assets } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function StoreAddProduct() {

    const categories = ["Men", "Women", "Packs", "Samples", "Niche Fragrances"];
    const sizes = ["5ML", "10ML", "30ML", "50ML", "60ML", "75ML", "100ML", "125ML", "200ML"];

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        category: "",
    })
    const [selectedSizes, setSelectedSizes] = useState({})
    const [loading, setLoading] = useState(false)
    const [aiUsed, setAiUsed] = useState(false)

    const { getToken } = useAuth()

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const handleSizeToggle = (size) => {
        setSelectedSizes(prev => {
            const newSizes = { ...prev }
            if (newSizes[size]) {
                delete newSizes[size]
            } else {
                newSizes[size] = { mrp: "", price: "" }
            }
            return newSizes
        })
    }

    const handleSizePrice = (size, field, value) => {
        setSelectedSizes(prev => ({
            ...prev,
            [size]: {
                ...prev[size],
                [field]: value
            }
        }))
    }

    const handleImageUpload = async (key, file) => {
        setImages(prev => ({ ...prev, [key]: file }))

        if (key === "1" && file && !aiUsed) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = async () => {
                const base64String = reader.result.split(",")[1]
                const mimeType = file.type
                const token = await getToken()

                try {
                    await toast.promise(
                        axios.post(
                            "/api/store/ai",
                            { base64Image: base64String, mimeType },
                            { headers: { Authorization: `Bearer ${token}` } }
                        ),
                        {
                            loading: "Analyzing image with AI...",
                            success: (res) => {
                                console.log(res);
                                
                                const data = res.data
                                if (data.name && data.description) {
                                    setProductInfo(prev => ({
                                        ...prev,
                                        name: data.name,
                                        description: data.description
                                    }))
                                    setAiUsed(true)
                                    return "AI filled product info 🎉"
                                }
                                return "AI could not analyze the image"
                            },
                            error: (err) =>
                                err?.response?.data?.error || err.message
                        }
                    )
                } catch (error) {
                    console.error(error)
                }
            }
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (!images[1] && !images[2] && !images[3] && !images[4]) {
                return toast.error('Please upload at least one image')
            }

            if (Object.keys(selectedSizes).length === 0) {
                return toast.error('Please select at least one size')
            }

            // Validate all selected sizes have prices
            for (const size of Object.keys(selectedSizes)) {
                if (!selectedSizes[size].mrp || !selectedSizes[size].price) {
                    return toast.error(`Please enter both prices for ${size}`)
                }
            }

            setLoading(true)

            const formData = new FormData()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('category', productInfo.category)
            
            // Send sizes as JSON string
            formData.append('sizes', JSON.stringify(selectedSizes))

            Object.keys(images).forEach((key) => {
                images[key] && formData.append('images', images[key])
            })

            const token = await getToken()
            const { data } = await axios.post('/api/store/product', formData, { 
                headers: { Authorization: `Bearer ${token}` } 
            })
            
            toast.success(data.message)

            setProductInfo({ name: "", description: "", category: "" })
            setSelectedSizes({})
            setImages({ 1: null, 2: null, 3: null, 4: null })
            setAiUsed(false)
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images</p>

            <div className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image
                            width={300}
                            height={300}
                            className='h-15 w-auto border border-slate-200 rounded cursor-pointer'
                            src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area}
                            alt=""
                        />
                        <input
                            type="file"
                            accept='image/*'
                            id={`images${key}`}
                            onChange={e => handleImageUpload(key, e.target.files[0])}
                            hidden
                        />
                    </label>
                ))}
            </div>

            <label className="flex flex-col gap-2 my-6 ">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <label className="flex flex-col gap-2 my-6">
                Category
                <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </label>

            <div className="my-6">
                <p className="mb-4 font-medium text-slate-700">Select Sizes and Set Prices</p>
                <div className="space-y-4">
                    {sizes.map((size) => (
                        <div key={size} className="flex items-center gap-4 p-3 border border-slate-200 rounded">
                            <label className="flex items-center gap-2 cursor-pointer min-w-[80px]">
                                <input
                                    type="checkbox"
                                    checked={!!selectedSizes[size]}
                                    onChange={() => handleSizeToggle(size)}
                                    className="w-4 h-4 cursor-pointer"
                                />
                                <span className="font-medium">{size}</span>
                            </label>
                            
                            {selectedSizes[size] && (
                                <div className="flex gap-3 flex-1">
                                    <input
                                        type="number"
                                        placeholder="Actual Price (MAD)"
                                        value={selectedSizes[size].mrp}
                                        onChange={(e) => handleSizePrice(size, 'mrp', e.target.value)}
                                        className="flex-1 p-2 px-4 outline-none border border-slate-200 rounded"
                                        required
                                    />
                                    <input
                                        type="number"
                                        placeholder="Offer Price (MAD)"
                                        value={selectedSizes[size].price}
                                        onChange={(e) => handleSizePrice(size, 'price', e.target.value)}
                                        className="flex-1 p-2 px-4 outline-none border border-slate-200 rounded"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition disabled:opacity-50 disabled:cursor-not-allowed">
                Add Product
            </button>
        </form>
    )
}
