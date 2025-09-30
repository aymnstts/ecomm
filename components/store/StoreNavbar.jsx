'use client'
import { useUser, UserButton} from "@clerk/nextjs"
import Link from "next/link"
import logoStore from "../../assets/logo_store.png"
import NextImage from "next/image"

const StoreNavbar = () => {

    const {user} = useUser()

    return (
    <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
        <Link href="/store" className="relative flex items-center">
            <NextImage 
                src={logoStore} 
                alt="AuraParfums Logo" 
                width={180} 
                height={60}
                className="object-contain"
                priority
            />
            <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-black-500">
                Store
            </p>
        </Link>
        <div className="flex items-center gap-3">
            <p>Hi, {user?.firstName}</p>
            <UserButton />
        </div>
    </div>
    )
}

export default StoreNavbar