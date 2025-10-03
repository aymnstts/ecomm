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
        const category = formData.get("category")
        const sizesJson = formData.get("sizes")
        const images = formData.getAll("images")

        if(!name || !description || !category || !sizesJson || images.length < 1){
            return NextResponse.json({error: 'missing product details'}, { status: 400 } )
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
                category,
                sizes, // Store the entire sizes object
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