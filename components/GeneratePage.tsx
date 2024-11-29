import React from 'react'
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


const GeneratePage = () => {
return (
    <div className="flex flex-col items-center min-h-screen p-4 gap-5">
        <div className="w-full max-w-2xl mt-5">
            <Textarea className="w-full mb-4" placeholder="Type your message here..." />
            <Button>
                Generate
            </Button>
        </div>
    </div>
)
}

export default GeneratePage
