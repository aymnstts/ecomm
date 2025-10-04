'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"

export default function Analytics() {
    const [analytics, setAnalytics] = useState(null)
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState('7d')
    const [showClearConfirm, setShowClearConfirm] = useState(false)
    const [clearing, setClearing] = useState(false)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch(`/api/analytics?range=${timeRange}`)
                const data = await res.json()
                setAnalytics(data)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchAnalytics()
    }, [timeRange])

    const handleClearAllData = async () => {
        setClearing(true)
        try {
            const res = await fetch('/api/analytics', {
                method: 'DELETE',
            })

            if (res.ok) {
                const refreshRes = await fetch(`/api/analytics?range=${timeRange}`)
                const data = await refreshRes.json()
                setAnalytics(data)
                setShowClearConfirm(false)
            } else {
                alert('Failed to clear analytics data')
            }
        } catch (error) {
            console.error('Clear error:', error)
            alert('Failed to clear analytics data')
        } finally {
            setClearing(false)
        }
    }

    if (loading) return <Loading />

    return (
        <div className="space-y-6">
            {/* Header with Clear Button and Time Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl">Site <span className="font-medium">Analytics</span></h1>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Clear All Data Button */}
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-red-700 text-sm font-medium transition"
                    >
                        🗑️ Clear All Data
                    </button>

                    {/* Time Range Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {[
                            { label: '24 Hours', value: '24h' },
                            { label: '7 Days', value: '7d' },
                            { label: '30 Days', value: '30d' },
                            { label: 'All Time', value: 'all' }
                        ].map(range => (
                            <button
                                key={range.value}
                                onClick={() => setTimeRange(range.value)}
                                className={`px-4 py-2 rounded text-sm font-medium transition ${
                                    timeRange === range.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-slate-600 hover:bg-slate-100 border'
                                }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Clear Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
                        <h3 className="text-lg font-semibold mb-2 text-red-600">⚠️ Clear All Analytics Data?</h3>
                        <p className="text-slate-600 mb-4">
                            This will permanently delete <strong>all analytics data</strong> from your database. 
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                disabled={clearing}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearAllData}
                                disabled={clearing}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {clearing ? 'Clearing...' : 'Yes, Clear All Data'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Visitors"
                    value={analytics?.totalVisitors || 0}
                    icon="👥"
                    color="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Unique Visitors"
                    value={analytics?.uniqueVisitors || 0}
                    icon="👤"
                    color="bg-green-50 text-green-600"
                />
                <StatCard
                    title="Page Views"
                    value={analytics?.pageViews || 0}
                    icon="📄"
                    color="bg-purple-50 text-purple-600"
                />
                <StatCard
                    title="Avg. Session"
                    value={analytics?.avgSessionTime || '0s'}
                    icon="⏱️"
                    color="bg-orange-50 text-orange-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4">🔥 Top Pages</h3>
                    <div className="space-y-3">
                        {analytics?.topPages?.map((page, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800">{page.path}</p>
                                    <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${(page.views / analytics.topPages[0].views) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <span className="ml-4 text-sm font-semibold text-slate-600">{page.views}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Locations */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4">🌍 Visitor Locations</h3>
                    <div className="space-y-3">
                        {analytics?.locations?.map((loc, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-2xl">{loc.flag}</span>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-800">{loc.country}</p>
                                        {loc.city && <p className="text-xs text-slate-500">{loc.city}</p>}
                                    </div>
                                </div>
                                <span className="text-sm font-semibold text-slate-600">{loc.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Devices */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4">📱 Devices</h3>
                    <div className="space-y-3">
                        {analytics?.devices?.map((device, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {device.type === 'mobile' ? '📱' : device.type === 'tablet' ? '📱' : '💻'}
                                    </span>
                                    <span className="text-sm font-medium text-slate-800 capitalize">{device.type}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 bg-slate-200 rounded-full h-2">
                                        <div
                                            className="bg-green-600 h-2 rounded-full"
                                            style={{ width: `${device.percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-600 w-12 text-right">
                                        {device.percentage}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Browsers */}
                <div className="bg-white p-6 rounded-lg shadow border">
                    <h3 className="text-lg font-semibold mb-4">🌐 Browsers</h3>
                    <div className="space-y-3">
                        {analytics?.browsers?.map((browser, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-800">{browser.name}</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 bg-slate-200 rounded-full h-2">
                                        <div
                                            className="bg-purple-600 h-2 rounded-full"
                                            style={{ width: `${browser.percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-slate-600 w-12 text-right">
                                        {browser.percentage}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Referrers */}
                <div className="bg-white p-6 rounded-lg shadow border lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">🔗 Traffic Sources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analytics?.referrers?.map((ref, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                                <div>
                                    <p className="text-sm font-medium text-slate-800">{ref.source}</p>
                                    <p className="text-xs text-slate-500">{ref.url || 'Direct'}</p>
                                </div>
                                <span className="text-sm font-semibold text-slate-600">{ref.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Visitors */}
            <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold mb-4">🕐 Recent Visitors</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-3">Time</th>
                                <th className="text-left py-2 px-3">Location</th>
                                <th className="text-left py-2 px-3">Page</th>
                                <th className="text-left py-2 px-3">Device</th>
                                <th className="text-left py-2 px-3">Browser</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics?.recentVisitors?.map((visitor, idx) => (
                                <tr key={idx} className="border-b hover:bg-slate-50">
                                    <td className="py-2 px-3 text-slate-600">
                                        {new Date(visitor.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="py-2 px-3">
                                        <span className="mr-1">{visitor.flag}</span>
                                        {visitor.country}
                                    </td>
                                    <td className="py-2 px-3 text-slate-600">{visitor.page}</td>
                                    <td className="py-2 px-3 text-slate-600 capitalize">{visitor.device}</td>
                                    <td className="py-2 px-3 text-slate-600">{visitor.browser}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-slate-800">{value}</p>
                </div>
                <div className={`text-3xl ${color} w-14 h-14 rounded-full flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}