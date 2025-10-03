import { Package, Award, Users, Heart } from 'lucide-react'

export default function About() {
    const values = [
        {
            icon: Package,
            title: "Quality Products",
            description: "We source only authentic fragrances from trusted suppliers and brands"
        },
        {
            icon: Award,
            title: "Best Prices",
            description: "Premium perfumes at competitive prices with regular discounts"
        },
        {
            icon: Users,
            title: "Customer First",
            description: "24/7 customer support and satisfaction guaranteed on every order"
        },
        {
            icon: Heart,
            title: "Passion for Perfume",
            description: "A carefully curated collection for every taste and occasion"
        }
    ]

    const stats = [
        { number: "1000+", label: "Happy Customers" },
        { number: "500+", label: "Products" },
        { number: "50+", label: "Premium Brands" },
        { number: "24/7", label: "Support" }
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                        About Aura Parfums
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        Your trusted destination for authentic fragrances in Morocco. We bring you the world's finest perfumes at prices that make luxury accessible to everyone.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-7xl mx-auto px-6 -mt-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                            <p className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                                {stat.number}
                            </p>
                            <p className="text-sm text-slate-600">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Our Story Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Story</h2>
                        <div className="space-y-4 text-slate-600">
                            <p>
                                Founded in Morocco, Aura Parfums was born from a passion for bringing authentic, high-quality fragrances to perfume lovers across the country.
                            </p>
                            <p>
                                We understand that a signature scent is more than just a fragrance—it's an expression of personality, a memory maker, and a confidence booster. That's why we're committed to offering only genuine products from the world's most respected perfume houses.
                            </p>
                            <p>
                                From designer classics to niche discoveries, we carefully curate our collection to ensure there's something special for everyone, whether you're searching for your everyday scent or that perfect gift.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-96 rounded-2xl overflow-hidden bg-slate-200">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-slate-400 text-center px-6">
                                [Add your store image here]
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-slate-50 py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">
                        Why Choose Us
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon
                            return (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                                        <Icon className="text-white" size={24} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-800 mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm">
                                        {value.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Mission</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                    To make luxury fragrances accessible to everyone in Morocco through authentic products, competitive pricing, and exceptional customer service. We believe everyone deserves to feel confident and special with their signature scent.
                </p>
                <a href="/shop" className="inline-block bg-slate-800 text-white px-8 py-3 rounded-lg hover:bg-slate-900 transition">
                    Explore Our Collection
                </a>
            </div>
        </div>
    )
}