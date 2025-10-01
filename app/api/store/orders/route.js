import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// Update seller order status
export async function POST(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const {orderId, status } = await request.json()

        await prisma.order.update({
            where: { id: orderId, storeId },
            data: {status}
        })

        return NextResponse.json({message: "Order Status updated"})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}

// Get all orders for a seller
export async function GET(request){
    try {
        const { userId } = getAuth(request)
        const storeId = await authSeller(userId)

        if(!storeId){
            return NextResponse.json({ error: 'not authorized' }, { status: 401 })
        }

        const orders = await prisma.order.findMany({
            where: {storeId},
            include: {user: true, address: true, orderItems: {include: {product: true}}},
            orderBy: {createdAt: 'desc' }
        })

        return NextResponse.json({orders})
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 })
    }
}
    export async function DELETE(request){
        try {
            const { userId } = getAuth(request)
            const storeId = await authSeller(userId)

            if(!storeId){
                return NextResponse.json({ error: 'not authorized' }, { status: 401 })
            }

            // Get orderId from query params
            const { searchParams } = new URL(request.url)
            const orderId = searchParams.get('orderId')

            if (!orderId) {
                return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
            }

            // Verify the order belongs to this store
            const existingOrder = await prisma.order.findUnique({
                where: { id: orderId }
            })

            if (!existingOrder) {
                return NextResponse.json({ error: 'Order not found' }, { status: 404 })
            }

            if (existingOrder.storeId !== storeId) {
                return NextResponse.json({ error: 'Not authorized to delete this order' }, { status: 403 })
            }

            // Delete order items first (if cascade delete is not set up in schema)
            await prisma.orderItem.deleteMany({
                where: { orderId: orderId }
            })

            // Delete the order
            await prisma.order.delete({
                where: { id: orderId }
            })

            return NextResponse.json({ 
                message: 'Order deleted successfully',
                deletedOrderId: orderId 
            })

        } catch (error) {
            console.error('Delete order error:', error);
            return NextResponse.json({ error: error.code || error.message }, { status: 400 })
        }
    }