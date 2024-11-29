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
import { useRouter } from "next/navigation";
import Image from 'next/image'


export function LandingPage() {
    const router = useRouter();
    return (
        <div className="flex flex-col min-h-[100dvh] bg-black text-white">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
                <header className="flex items-center justify-between ">
                    <Link href="/" prefetch={false}>
                        <span className="text-primary-foreground font-bold text-2xl md:text-3xl">
                            ChartGenie
                        </span>
                    </Link>
                    <div className="flex items-center space-x-4 md:space-x-6">
                        <nav className="flex items-center gap-4 sm:gap-6">
                            <Link
                                href="#features"
                                className="text-base font-medium  hover:underline underline-offset-4"
                                prefetch={false}
                            >
                                Features
                            </Link>
                            <Link
                                href="#howitworks"
                                className="text-base font-medium hover:underline underline-offset-4"
                                prefetch={false}
                            >
                                How It Works
                            </Link>
                            <Link
                                href="#pricing"
                                className="text-base font-medium  hover:underline underline-offset-4"
                                prefetch={false}
                            >
                                Pricing
                            </Link>
                        </nav>
                        <div className=" hidden md:flex items-center gap-4">
                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button variant="outline" className="bg-white-to-r from-indigo-500 to-purple-600 rounded-md font-medium hover:from-indigo-600 hover:to-white-700 focus:outline-none focus:ring-2 focus:ring-offset-2  text-white"
                                    >Login</Button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <Button variant="outline" className="bg-white-to-r from-indigo-500 to-purple-600 rounded-md font-medium hover:from-indigo-600 hover:to-white-700 focus:outline-none focus:ring-2 focus:ring-offset-2  text-white"
                                    >Sign Up</Button>
                                </SignUpButton>
                            </SignedOut>
                            <SignedIn>
                                <UserButton afterSignOutUrl="/" />
                            </SignedIn>
                        </div>
                    </div>
                </header>
                <main className="flex-1 flex flex-col items-center justify-center text-center ">
                    <div className="max-w-3xl mx-auto space-y-4 text-center pt-20 md:pt-36 ">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                            AI Powered Data Visualization
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mt-6">
                            VisualizeAI is a cutting-edge web application that empowers users to
                            create stunning, AI-generated data visualizations in just a few
                            clicks.
                        </p>
                        <Button
                            onClick={() => router.push('/generate')}
                            className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md text-white"
                        >
                            Get Started
                        </Button>
                    </div>
                    <Image
                        src="/placeholder.png"
                        alt="chartgenielogo"
                        width={500}
                        height={400}
                        className="mt-16 w-auto h-auto max-w-md md:max-w-lg  xl:max-w-2xl object-contain"
                        />
                        
                </main>
                <footer className="py-4 text-center text-gray-500">
                    <p>
                    <Image
                        src="/samespace.jpg"
                        alt="Landscape picture"
                        width={800}
                        height={500}
                        className="h-6 w-auto inline-block align-middle mr-1"
                        />
                        Supported by SameSpace
                    </p>
                </footer>
            </div>
        </div>
    );
}