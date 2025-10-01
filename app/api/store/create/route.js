import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { authSeller } from "@/lib/authSeller"; // or wherever this function is

// GET - Fetch products
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }

        const products = await prisma.product.findMany({
            where: { storeId: storeId }
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

// POST - Create product
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }

        // Your existing POST logic here
        // ...

        return NextResponse.json({ message: 'Product created successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

// DELETE - Delete product
export async function DELETE(request) {
    console.log('DELETE method called'); // Debug log
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);

        if (!storeId) {
            return NextResponse.json({ error: 'not authorized' }, { status: 401 });
        }

        // Get productId from query params
        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // Verify the product belongs to this store
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        if (existingProduct.storeId !== storeId) {
            return NextResponse.json({ error: 'Not authorized to delete this product' }, { status: 403 });
        }

        // Optional: Delete images from ImageKit
        // for (const imageUrl of existingProduct.images) {
        //     try {
        //         // Extract fileId from URL and delete
        //         // const fileId = extractFileIdFromUrl(imageUrl);
        //         // await imagekit.deleteFile(fileId);
        //     } catch (error) {
        //         console.error("Error deleting image:", error);
        //     }
        // }

        // Delete the product
        await prisma.product.delete({
            where: { id: productId }
        });

        return NextResponse.json({ 
            message: 'Product deleted successfully',
            deletedProductId: productId 
        });

    } catch (error) {
        console.error('Delete product error:', error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}