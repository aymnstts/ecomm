// app/api/analytics/track/route.js
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { UAParser } from 'ua-parser-js'

export async function POST(request) {
    try {
        const { path, userAgent, referer, ip, timestamp } = await request.json()

        // Parse user agent
        const parser = new UAParser(userAgent)
        const result = parser.getResult()

        // Determine device type
        let device = 'desktop'
        if (result.device.type === 'mobile') device = 'mobile'
        else if (result.device.type === 'tablet') device = 'tablet'

        // Get browser name
        const browser = result.browser.name || 'Unknown'

        // Get location data (you'll need to integrate a GeoIP service)
        const locationData = await getLocationFromIP(ip)

        // Store analytics
        await prisma.analytics.create({
            data: {
                path,
                ip,
                userAgent,
                referrer: referer || 'Direct',
                device,
                browser,
                country: locationData.country,
                city: locationData.city,
                countryCode: locationData.countryCode,
                timestamp: new Date(timestamp)
            }
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Analytics tracking error:', error)
        return NextResponse.json(
            { error: 'Failed to track visit' },
            { status: 500 }
        )
    }
}

async function getLocationFromIP(ip) {
    try {
        // Using ip-api.com (free service, 45 requests per minute)
        // For production, consider using ipinfo.io, ipgeolocation.io, or maxmind
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,countryCode`)
        const data = await response.json()

        if (data.status === 'success') {
            return {
                country: data.country,
                city: data.city,
                countryCode: data.countryCode
            }
        }
    } catch (error) {
        console.error('GeoIP lookup error:', error)
    }

    return {
        country: 'Unknown',
        city: null,
        countryCode: 'unknown'
    }
}