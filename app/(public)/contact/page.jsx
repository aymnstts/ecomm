'use client'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const contactInfo = [
        {
            icon: Phone,
            title: "Phone",
            details: ["+212 6 16 11 42 60", "+212 7 10 83 72 12"],
            link: "tel:+212616114260"
        },
        {
            icon: Mail,
            title: "Email",
            details: ["aurafragrance1@gmail.com"],
            link: "mailto:aurafragrance1@gmail.com"
        },
        {
            icon: MapPin,
            title: "Location",
            details: ["Marrakech, Morocco", "45000"],
            link: null
        },
        {
            icon: Clock,
            title: "Working Hours",
            details: ["Monday - Saturday: 9AM - 8PM", "Sunday: 10AM - 6PM"],
            link: null
        }
    ]

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

   const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send message')
        }

        toast.success(data.message)
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
        toast.error(error.message)
    } finally {
        setIsSubmitting(false)
    }
}
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Hero Section */}
            <div className="bg-slate-800 text-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-lg text-slate-300">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Information Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                {contactInfo.map((item, index) => {
                                    const Icon = item.icon
                                    return (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                                                    <Icon className="text-slate-800" size={20} />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800 mb-1">
                                                    {item.title}
                                                </h3>
                                                {item.details.map((detail, idx) => (
                                                    <p key={idx} className="text-sm text-slate-600">
                                                        {item.link && idx === 0 ? (
                                                            <a href={item.link} className="hover:text-slate-800 transition">
                                                                {detail}
                                                            </a>
                                                        ) : (
                                                            detail
                                                        )}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="font-semibold text-slate-800 mb-4">Connect With Us</h3>
                            <div className="flex gap-3">
                                <a href="https://wa.me/212710837212" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center hover:bg-green-600 transition">
                                    <MessageSquare className="text-white" size={20} />
                                </a>
                                <a href="https://www.instagram.com/auraparfums1/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center hover:bg-pink-600 transition">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </a>
                                <a href="https://www.tiktok.com/@auraparfums" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                                            placeholder="+212 6XX XXX XXX"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                                            placeholder="How can we help?"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-800 text-white py-3 px-6 rounded-lg hover:bg-slate-900 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>Processing...</>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-16 bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2">Do you ship nationwide?</h3>
                            <p className="text-sm text-slate-600">
                                Yes, we ship to all cities across Morocco with fast and reliable delivery.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2">Are all products authentic?</h3>
                            <p className="text-sm text-slate-600">
                                Absolutely! We guarantee 100% authentic products from authorized distributors.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2">What payment methods do you accept?</h3>
                            <p className="text-sm text-slate-600">
                                We accept Cash on Delivery (COD) for your convenience and security.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 mb-2">Can I return a product?</h3>
                            <p className="text-sm text-slate-600">
                                Yes, we have a return policy. Contact us within 7 days of delivery for assistance.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}