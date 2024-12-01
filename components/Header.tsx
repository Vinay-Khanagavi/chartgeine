'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    SignInButton,
    SignedIn,
    SignUpButton,
    SignedOut,
    UserButton,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Header() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }

    return (
        <header className="flex items-center justify-between bg-black text-white py-4">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between">
                <link rel="icon" href="/logo.png" sizes="any" />
                <Link href="/" prefetch={false}>
                    <span className="text-primary-foreground font-bold text-2xl md:text-3xl">
                        ChartGenie
                    </span>
                </Link>
                <div className="flex items-center space-x-4 md:space-x-6">
                    <nav className="flex items-center gap-4 sm:gap-6">
                        <Link
                            href="https://github.com/Vinay-Khanagavi/chartgeine"
                            className="text-base font-medium hover:underline underline-offset-4"
                            prefetch={false}
                        >
                            Github
                        </Link>
                        <Link
                            href="https://vinaykhanagavi.me"
                            className="text-base font-medium hover:underline underline-offset-4"
                            prefetch={false}
                        >
                            Portfolio
                        </Link>
                    </nav>
                    <div className="hidden md:flex items-center gap-4">
                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button 
                                    variant="outline" 
                                    className="bg-white-to-r from-indigo-500 to-purple-600 rounded-md font-medium hover:from-indigo-600 hover:to-white-700 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white"
                                >
                                    Login
                                </Button>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <Button 
                                    variant="outline" 
                                    className="bg-white-to-r from-indigo-500 to-purple-600 rounded-md font-medium hover:from-indigo-600 hover:to-white-700 focus:outline-none focus:ring-2 focus:ring-offset-2 text-white"
                                >
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </header>
    );
}