import imagekit from "@/configs/imageKit"
import prisma from "@/lib/prisma"
import authSeller from "@/middlewares/authSeller"
import {getAuth} from "@clerk/nextjs/server"
import { NextResponse } from "next/server";

// Add a new product
export async function POST(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: 'not authorized'}, { status: 401 } )
        }
        // Get the data from the form
        const formData = await request.formData()
        const name = formData.get("name")
        const description = formData.get("description")
        const categoriesJson = formData.get("categories")
        const sizesJson = formData.get("sizes")
        const images = formData.getAll("images")

        if(!name || !description || !categoriesJson || !sizesJson || images.length < 1){
            return NextResponse.json({error: 'missing product details'}, { status: 400 } )
        }

        // Parse the categories JSON
        let categories
        try {
            categories = JSON.parse(categoriesJson)
        } catch (error) {
            return NextResponse.json({error: 'invalid categories format'}, { status: 400 } )
        }

        // Validate categories array
        if(!categories || !Array.isArray(categories) || categories.length === 0){
            return NextResponse.json({error: 'at least one category is required'}, { status: 400 } )
        }

        // Parse the sizes JSON
        let sizes
        try {
            sizes = JSON.parse(sizesJson)
        } catch (error) {
            return NextResponse.json({error: 'invalid sizes format'}, { status: 400 } )
        }

        // Validate sizes object
        if(!sizes || Object.keys(sizes).length === 0){
            return NextResponse.json({error: 'at least one size is required'}, { status: 400 } )
        }

        // Validate each size has mrp and price
        for (const [size, pricing] of Object.entries(sizes)) {
            if(!pricing.mrp || !pricing.price){
                return NextResponse.json({error: `missing price for size ${size}`}, { status: 400 } )
            }
        }

        // Uploading Images to ImageKit
        const imagesUrl = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(await image.arrayBuffer());
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.name,
                folder: "products",
            })
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1024' }
                ]
            })
            return url
        }))

        await prisma.product.create({
             data: {
                name,
                description,
                categories, // Array of categories
                sizes, // Object with sizes
                images: imagesUrl,
                storeId
             }
        })

         return NextResponse.json({message: "Product added successfully"})

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}
// Get all products for a seller
export async function GET(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: 'not authorized'}, { status: 401 } )
        }
        const products = await prisma.product.findMany({ where: { storeId }})

        return NextResponse.json({products})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }

}
// Delete a product
export async function DELETE(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({error: 'not authorized'}, { status: 401 } )
        }

        const url = new URL(request.url)
        const productId = url.searchParams.get('productId')

        if(!productId){
            return NextResponse.json({error: 'product ID required'}, { status: 400 } )
        }

        // Verify product belongs to this store
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { orderItems: true }
        })

        if(!product){
            return NextResponse.json({error: 'product not found'}, { status: 404 } )
        }

        if(product.storeId !== storeId){
            return NextResponse.json({error: 'unauthorized'}, { status: 403 } )
        }

        // Check if product has been ordered
        if(product.orderItems && product.orderItems.length > 0){
            return NextResponse.json({
                error: 'Cannot delete product that has been ordered. You can mark it as out of stock instead.'
            }, { status: 400 })
        }

        // Delete the product from database
        await prisma.product.delete({
            where: { id: productId }
        })

        return NextResponse.json({message: "Product deleted successfully"})

    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 400 })
    }
}