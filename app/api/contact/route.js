import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
    try {
        const { name, email, phone, subject, message } = await request.json()

        // Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' }, 
                { status: 400 }
            )
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email address' }, 
                { status: 400 }
            )
        }

        // Save to database
        await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone: phone || null,
                subject,
                message
            }
        })

        return NextResponse.json({ 
            message: 'Message sent successfully!' 
        })

    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { error: 'Failed to send message' }, 
            { status: 500 }
        )
    }
}

// Get all contact messages (for admin)
export async function GET(request) {
    try {
        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ messages })
    } catch (error) {
        console.error('Fetch messages error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch messages' }, 
            { status: 500 }
        )
    }
}
// Delete a contact message (for admin)
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { error: 'Message ID is required' }, 
                { status: 400 }
            )
        }

        await prisma.contactMessage.delete({
            where: { id }
        })

        return NextResponse.json({ 
            message: 'Message deleted successfully' 
        })

    } catch (error) {
        console.error('Delete message error:', error)
        return NextResponse.json(
            { error: 'Failed to delete message' }, 
            { status: 500 }
        )
    }
}