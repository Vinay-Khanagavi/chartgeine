"use client"
import { useState, useRef } from 'react';
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
import { Loader2, Download, Code } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define interfaces for chart data
interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
}

interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

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
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [chartTitle, setChartTitle] = useState("");
    const [chartSubTitle, setChartSubTitle] = useState("");
    const chartRef = useRef<any>(null);
    

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

            let data: ChartData;
            try {
                data = JSON.parse(responseText);
            } catch {
                throw new Error(`Failed to parse response: ${responseText}`);
            }

            // Check for error in the parsed response
            if ('error' in data) {
                throw new Error((data as { error: string }).error);
            }

            // Validate chart data structure
            if (!data.labels || !data.datasets) {
                throw new Error('Invalid chart data received');
            }

            setChartData({
                ...data,
                datasets: data.datasets.map((dataset: ChartDataset) => ({
                    ...dataset,
                    backgroundColor: dataset.backgroundColor ||
                        'rgba(75, 192, 192, 0.6)'
                }))
            });
        } catch (error: unknown) {
            console.error('Detailed error generating chart:', error);
            setError(
                error instanceof Error ? error.message :
                    'An unexpected error occurred while generating the chart'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportPNG = () => {
        if (chartRef.current) {
            const link = document.createElement('a');
            link.download = `${chartTitle || 'chart'}.png`;
            link.href = chartRef.current.toBase64Image();
            link.click();

            alert('Chart exported as PNG');
        }
    };

    const handleExportSVG = () => {
        if (chartRef.current) {
            // Convert chart to SVG 
            const svg = chartRef.current.canvas.toDataURL('image/svg+xml');
            const link = document.createElement('a');
            link.download = `${chartTitle || 'chart'}.svg`;
            link.href = svg;
            link.click();

            alert('Chart exported as SVG');
        }
    };

    const handleCopyEmbedCode = () => {
        if (chartData) {
            // Generate a basic embeddable code snippet
            const embedCode = `
<!-- Embedded Chart -->
<div style="width: 600px; height: 400px;">
    <canvas id="embeddedChart"></canvas>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        const ctx = document.getElementById('embeddedChart').getContext('2d');
        new Chart(ctx, ${JSON.stringify({
                type: 'bar',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            })});
    </script>
</div>
            `.trim();

            navigator.clipboard.writeText(embedCode).then(() => {
                alert('Embed code copied to clipboard');
            });
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

                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="ml-5" variant={"outline"}>Customize</Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px]" side="left">
                        <SheetHeader>
                            <SheetTitle>Chart Customization</SheetTitle>
                            <SheetDescription>
                                Edit the title, subtitle, and export options.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col w-full gap-2 py-4">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={chartTitle}
                                onChange={e => setChartTitle(e.target.value)}
                            />
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Input
                                id="subtitle"
                                value={chartSubTitle}
                                onChange={e => setChartSubTitle(e.target.value)}
                            />
                        </div>
                        <SheetFooter className="mt-4 flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleExportPNG}
                                disabled={!chartData}
                                className="w-full"
                            >
                                <Download className="mr-2 h-4 w-4" /> Export PNG
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleExportSVG}
                                disabled={!chartData}
                                className="w-full"
                            >
                                <Download className="mr-2 h-4 w-4" /> Export SVG
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCopyEmbedCode}
                                disabled={!chartData}
                                className="w-full"
                            >
                                <Code className="mr-2 h-4 w-4" /> Copy Embed Code
                            </Button>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

            {error && (
                <div className="text-red-500 text-center w-full max-w-2xl">
                    {error}
                </div>
            )}
            {chartData && (
                <div className="w-full max-w-4xl h-[400px] mt-5">
                    <Bar
                        ref={chartRef}
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                title: {
                                    display: !!chartTitle,
                                    text: chartTitle
                                },
                                subtitle: {
                                    display: !!chartSubTitle,
                                    text: chartSubTitle
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