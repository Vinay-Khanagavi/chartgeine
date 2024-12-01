'use client';

import { Button } from "@/components/ui/button";
import { 
    SignedIn, 
    SignedOut, 
    SignUpButton,
    useUser,
    useClerk
} from "@clerk/nextjs";
import Image from 'next/image';
import { useRouter } from "next/navigation";

export function LandingPage() {
    const router = useRouter();
    const { isSignedIn } = useUser();
    const { openSignUp } = useClerk();

    const handleGetStarted = () => {
        if (isSignedIn) {
            router.push('/generate');
        } else {
            openSignUp();
        }
    };

    return (
        <div className="flex flex-col min-h-[100dvh] bg-black text-white">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 flex-grow">
                <main className="flex-1 flex flex-col items-center justify-center text-center">
                    <div className="max-w-3xl mx-auto space-y-4 text-center pt-10 md:pt-20">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                            AI Powered Data Visualization
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mt-6">
                            ChartGenie is an amazing web application that helps users to
                            create stunning, AI-generated data visualizations in just a few
                            clicks. 
                            Add your data, and let ChartGenie do the rest.
                        </p>
                        
                        <Button
                            onClick={handleGetStarted}
                            className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-md font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md text-white"
                        >
                            Get Started
                        </Button>
                    </div>
                    <Image
                        src="/genie.png"
                        alt="chartgenielogo"
                        width={500}
                        height={400}
                        className="mt-10 w-auto h-auto max-w-md md:max-w-lg xl:max-w-2xl object-contain"
                    />
                </main>
            </div>
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
    );
}