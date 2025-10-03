'use client'
import { PackageIcon, Search, ShoppingCart, Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import {useUser, useClerk, UserButton, Protect} from "@clerk/nextjs"
import logoStore from "../assets/logo_store.png"

const Navbar = () => {

    const {user} = useUser()
    const {openSignIn} = useClerk()
    const router = useRouter();

    const [search, setSearch] = useState('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const cartCount = useSelector(state => state.cart.total)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    const closeMobileMenu = () => {
        setMobileMenuOpen(false)
    }

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4 transition-all">

                    <Link href="/" className="relative flex items-center">
                        <Image 
                            src={logoStore} 
                            alt="AuraParfums Logo" 
                            width={180} 
                            height={60}
                            className="object-contain"
                            priority
                        />
                        <Protect plan='plus'>
                             <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                            </p>
                        </Protect>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600">
                        <Link href="/">Home</Link>
                        <Link href="/shop">Shop</Link>
                        <Link href="/about">About</Link>
                        <Link href="/contact">Contact</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        <Link href="/cart" className="relative flex items-center gap-2 text-slate-600">
                            <ShoppingCart size={18} />
                            Cart
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                    {
                        !user ? (
                            <button onClick={openSignIn} className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                            Login
                            </button>
                        ) : (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action labelIcon={<PackageIcon size={16}/>} label="My Orders" onClick={()=> router.push('/orders')}/>
                                </UserButton.MenuItems>
                            </UserButton>
                        )
                    }
                    </div>

                    {/* Mobile Menu Button & User */}
                    <div className="sm:hidden flex items-center gap-3">
                        <Link href="/cart" className="relative">
                            <ShoppingCart size={20} className="text-slate-600" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 text-[8px] text-white bg-slate-600 size-3.5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        { user ? (
                            <UserButton>
                                <UserButton.MenuItems>
                                    <UserButton.Action labelIcon={<PackageIcon size={16}/>} label="My Orders" onClick={()=> router.push('/orders')}/>
                                </UserButton.MenuItems>
                            </UserButton>
                        ) : (
                            <button onClick={openSignIn} className="px-5 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                                Login
                            </button>
                        )}

                        <button 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-600"
                        >
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="sm:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200">
                    <div className="flex flex-col p-6 space-y-4 text-slate-600">
                        <Link href="/" onClick={closeMobileMenu} className="py-2 hover:text-slate-900 transition">
                            Home
                        </Link>
                        <Link href="/shop" onClick={closeMobileMenu} className="py-2 hover:text-slate-900 transition">
                            Shop
                        </Link>
                        <Link href="/about" onClick={closeMobileMenu} className="py-2 hover:text-slate-900 transition">
                            About
                        </Link>
                        <Link href="/contact" onClick={closeMobileMenu} className="py-2 hover:text-slate-900 transition">
                            Contact
                        </Link>

                        {/* Mobile Search */}
                        <form onSubmit={(e) => { handleSearch(e); closeMobileMenu(); }} className="pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2 bg-slate-100 px-4 py-3 rounded-full">
                                <Search size={18} className="text-slate-600" />
                                <input 
                                    className="w-full bg-transparent outline-none placeholder-slate-600 text-sm" 
                                    type="text" 
                                    placeholder="Search products" 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)} 
                                    required 
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar