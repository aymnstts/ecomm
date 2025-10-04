import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import WhatsAppFloat from '@/components/WhatsAppFloat'

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "AuraParfums. - Your Daily Scent ",
    description: "AuraParfums. - Your Daily Scent ",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${outfit.className} antialiased`}>
                    <StoreProvider>
                        <Toaster />
                        {children}
                        <WhatsAppFloat />
                    </StoreProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
