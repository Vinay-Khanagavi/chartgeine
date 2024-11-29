"use client"
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const GeneratePage = () => {
    const [input, setInput] = useState('');
    const [chartData, setChartData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {

        setError(null);
        setChartData(null);
        setIsLoading(true);

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: input })
            });

            // Parse the response text first
            const responseText = await response.text();

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (parseError) {
                throw new Error(`Failed to parse response: ${responseText}`);
            }

            // Check for error in the parsed response
            if (data.error) {
                throw new Error(data.error);
            }

            // Validate chart data structure
            if (!data.labels || !data.datasets) {
                throw new Error('Invalid chart data received');
            }

            setChartData({
                ...data,
                datasets: data.datasets.map((dataset: any) => ({
                    ...dataset,
                    backgroundColor: dataset.backgroundColor || 
                        'rgba(75, 192, 192, 0.6)'
                }))
            });
        } catch (error: any) {
            console.error('Detailed error generating chart:', error);
            setError(
                error.message || 
                'An unexpected error occurred while generating the chart'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 gap-5">
            <div className="w-full max-w-2xl mt-5">
                <Textarea
                    className="w-full mb-4"
                    placeholder="Describe the chart you want to generate (e.g., 'Sales comparison for Q1 2024')"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button 
                    onClick={handleGenerate} 
                    disabled={!input || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        'Generate Chart'
                    )}
                </Button>
            </div>

            {error && (
                <div className="text-red-500 text-center w-full max-w-2xl">
                    {error}
                </div>
            )}
            {chartData && (
                <div className="w-full max-w-4xl h-[400px] mt-5">
                    <Bar 
                        data={chartData} 
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }} 
                    />
                </div>
            )}
        </div>
    );
};

export default GeneratePage;