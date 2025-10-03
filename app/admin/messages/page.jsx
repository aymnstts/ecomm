'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"

export default function ContactMessages() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch('/api/contact')
                const data = await res.json()
                setMessages(data.messages)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchMessages()
    }, [])

    if (loading) return <Loading />

    return (
        <div>
            <h1 className="text-2xl mb-5">Contact <span className="font-medium">Messages</span></h1>
            <div className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="bg-white p-6 rounded-lg shadow border">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-semibold text-lg">{msg.name}</h3>
                            <span className="text-sm text-slate-500">
                                {new Date(msg.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{msg.email}</p>
                        {msg.phone && <p className="text-sm text-slate-600 mb-1">{msg.phone}</p>}
                        <p className="font-medium text-slate-800 mt-3">Subject: {msg.subject}</p>
                        <p className="text-slate-700 mt-2">{msg.message}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}