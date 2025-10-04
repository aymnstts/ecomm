// app/api/analytics/track/route.js
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(request) {
    console.log('📥 Track API called')
    
    try {
        const body = await request.json()
        console.log('📦 Received data:', body)

        const { path, userAgent, referer, ip, timestamp } = body

        // Simple device detection without ua-parser-js for now
        let device = 'desktop'
        let browser = 'Unknown'
        
        if (userAgent) {
            if (/mobile/i.test(userAgent)) device = 'mobile'
            else if (/tablet/i.test(userAgent)) device = 'tablet'
            
            if (/chrome/i.test(userAgent)) browser = 'Chrome'
            else if (/safari/i.test(userAgent)) browser = 'Safari'
            else if (/firefox/i.test(userAgent)) browser = 'Firefox'
            else if (/edge/i.test(userAgent)) browser = 'Edge'
        }

        console.log('💾 Saving to database...')

        // Store analytics without location for now
        const result = await prisma.analytics.create({
            data: {
                path,
                ip,
                userAgent,
                referrer: referer || 'Direct',
                device,
                browser,
                country: 'Unknown',
                city: null,
                countryCode: 'unknown',
                timestamp: new Date(timestamp)
            }
        })

        console.log('✅ Saved successfully:', result.id)

        return NextResponse.json({ success: true, id: result.id })

    } catch (error) {
        console.error('❌ Analytics tracking error:', error)
        return NextResponse.json(
            { error: 'Failed to track visit', details: error.message },
            { status: 500 }
        )
    }
}