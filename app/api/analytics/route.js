// app/api/analytics/route.js
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const range = searchParams.get('range') || '7d'

        // Calculate date filter
        let dateFilter = {}
        const now = new Date()
        
        switch(range) {
            case '24h':
                dateFilter = { gte: new Date(now - 24 * 60 * 60 * 1000) }
                break
            case '7d':
                dateFilter = { gte: new Date(now - 7 * 24 * 60 * 60 * 1000) }
                break
            case '30d':
                dateFilter = { gte: new Date(now - 30 * 24 * 60 * 60 * 1000) }
                break
            default:
                dateFilter = {}
        }

        // Fetch all analytics data
        const visits = await prisma.analytics.findMany({
            where: dateFilter.gte ? { timestamp: dateFilter } : {},
            orderBy: { timestamp: 'desc' }
        })

        // Calculate statistics
        const totalVisitors = visits.length
        const uniqueVisitors = new Set(visits.map(v => v.ip)).size
        const pageViews = visits.length

        // Calculate average session time (simplified)
        const avgSessionTime = calculateAvgSessionTime(visits)

        // Top pages
        const pageCounts = {}
        visits.forEach(v => {
            pageCounts[v.path] = (pageCounts[v.path] || 0) + 1
        })
        const topPages = Object.entries(pageCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([path, views]) => ({ path, views }))

        // Locations
        const locationCounts = {}
        visits.forEach(v => {
            const key = `${v.country}|${v.city}|${v.countryCode}`
            locationCounts[key] = (locationCounts[key] || 0) + 1
        })
        const locations = Object.entries(locationCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([key, count]) => {
                const [country, city, countryCode] = key.split('|')
                return {
                    country: country || 'Unknown',
                    city: city || null,
                    flag: getCountryFlag(countryCode),
                    count
                }
            })

        // Devices
        const deviceCounts = { mobile: 0, tablet: 0, desktop: 0 }
        visits.forEach(v => {
            deviceCounts[v.device] = (deviceCounts[v.device] || 0) + 1
        })
        const devices = Object.entries(deviceCounts)
            .map(([type, count]) => ({
                type,
                percentage: Math.round((count / totalVisitors) * 100)
            }))
            .sort((a, b) => b.percentage - a.percentage)

        // Browsers
        const browserCounts = {}
        visits.forEach(v => {
            browserCounts[v.browser] = (browserCounts[v.browser] || 0) + 1
        })
        const browsers = Object.entries(browserCounts)
            .map(([name, count]) => ({
                name,
                percentage: Math.round((count / totalVisitors) * 100)
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5)

        // Referrers
        const referrerCounts = {}
        visits.forEach(v => {
            if (v.referrer && v.referrer !== 'Direct') {
                referrerCounts[v.referrer] = (referrerCounts[v.referrer] || 0) + 1
            }
        })
        const referrers = Object.entries(referrerCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([url, count]) => {
                const source = extractDomain(url)
                return { source, url, count }
            })
        
        // Add direct traffic
        const directCount = visits.filter(v => !v.referrer || v.referrer === 'Direct').length
        if (directCount > 0) {
            referrers.push({ source: 'Direct', url: null, count: directCount })
        }

        // Recent visitors
        const recentVisitors = visits.slice(0, 10).map(v => ({
            timestamp: v.timestamp,
            country: v.country || 'Unknown',
            flag: getCountryFlag(v.countryCode),
            page: v.path,
            device: v.device,
            browser: v.browser
        }))

        return NextResponse.json({
            totalVisitors,
            uniqueVisitors,
            pageViews,
            avgSessionTime,
            topPages,
            locations,
            devices,
            browsers,
            referrers,
            recentVisitors
        })

    } catch (error) {
        console.error('Analytics fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}

// Delete all analytics data
export async function DELETE(request) {
    try {
        await prisma.analytics.deleteMany({})

        return NextResponse.json({ 
            message: 'All analytics data cleared successfully' 
        })

    } catch (error) {
        console.error('Clear analytics error:', error)
        return NextResponse.json(
            { error: 'Failed to clear analytics data' },
            { status: 500 }
        )
    }
}

function calculateAvgSessionTime(visits) {
    if (visits.length === 0) return '0s'
    
    // Group by IP to calculate sessions
    const sessions = {}
    visits.forEach(v => {
        if (!sessions[v.ip]) sessions[v.ip] = []
        sessions[v.ip].push(new Date(v.timestamp))
    })
    
    let totalTime = 0
    let sessionCount = 0
    
    Object.values(sessions).forEach(times => {
        if (times.length > 1) {
            times.sort((a, b) => a - b)
            const duration = (times[times.length - 1] - times[0]) / 1000
            totalTime += duration
            sessionCount++
        }
    })
    
    if (sessionCount === 0) return '0s'
    
    const avgSeconds = Math.round(totalTime / sessionCount)
    if (avgSeconds < 60) return `${avgSeconds}s`
    return `${Math.round(avgSeconds / 60)}m`
}

function extractDomain(url) {
    try {
        const domain = new URL(url).hostname.replace('www.', '')
        return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)
    } catch {
        return 'Unknown'
    }
}

function getCountryFlag(countryCode) {
    if (!countryCode || countryCode === 'unknown') return '🌍'
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0))
    return String.fromCodePoint(...codePoints)
}