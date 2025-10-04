'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"

export default function ContactMessages() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)

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

    const handleDelete = async (id) => {
        setDeletingId(id)
        try {
            const res = await fetch(`/api/contact?id=${id}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                setMessages(messages.filter(msg => msg.id !== id))
            } else {
                const data = await res.json()
                alert(data.error || 'Failed to delete message')
            }
        } catch (error) {
            console.error('Delete error:', error)
            alert('Failed to delete message')
        } finally {
            setDeletingId(null)
            setConfirmDelete(null)
        }
    }

    if (loading) return <Loading />

    return (
        <div>
            <h1 className="text-2xl mb-5">Contact <span className="font-medium">Messages</span></h1>
            <div className="space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="bg-white p-6 rounded-lg shadow border relative">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-semibold text-lg">{msg.name}</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-500">
                                    {new Date(msg.createdAt).toLocaleString()}
                                </span>
                                <button
                                    onClick={() => setConfirmDelete(msg.id)}
                                    disabled={deletingId === msg.id}
                                    className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                                >
                                    {deletingId === msg.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{msg.email}</p>
                        {msg.phone && <p className="text-sm text-slate-600 mb-1">{msg.phone}</p>}
                        <p className="font-medium text-slate-800 mt-3">Subject: {msg.subject}</p>
                        <p className="text-slate-700 mt-2">{msg.message}</p>

                        {/* Custom Delete Confirmation Modal */}
                        {confirmDelete === msg.id && (
                            <div className="absolute inset-0 bg-white bg-opacity-50 rounded-lg flex items-center justify-center">
                                <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
                                    <h3 className="text-lg font-semibold mb-2">Delete Message?</h3>
                                    <p className="text-slate-600 mb-4">
                                        Are you sure you want to delete this message? This action cannot be undone.
                                    </p>
                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={() => setConfirmDelete(null)}
                                            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}