import { LandingPage } from "@/components/landingPage";
import { ClerkProvider } from "@clerk/nextjs";

export default function Home() {
  return (
    <ClerkProvider>
            
            <LandingPage />
    </ClerkProvider> 
    );
}
