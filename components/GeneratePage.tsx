"use client"
import { useState, useRef } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import Spline, { SplineProps } from '@splinetool/react-spline';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Define interfaces for chart data
interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
}

interface ChartData {
    type?: string;
    labels: string[];
    datasets: ChartDataset[];
}

// Define chart type options
const CHART_TYPES = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'line', label: 'Line Chart' }
] as const;

type ChartType = typeof CHART_TYPES[number]['value'];

const GeneratePage = () => {
    const [input, setInput] = useState('');
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [chartType, setChartType] = useState<ChartType>('bar');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [chartTitle, setChartTitle] = useState("");
    const [chartSubTitle, setChartSubTitle] = useState("");
    const [chartLabel, setChartLabel] = useState("");
    const [chartColor, setChartColor] = useState("");

    const chartRef = useRef<any>(null);
    const sceneUrl: SplineProps['scene'] = "https://prod.spline.design/SbVft5e6GVtV5-P7/scene.splinecode";


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
                body: JSON.stringify({
                    prompt: input,
                    chartType: chartType
                })
            });

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
                type: chartType
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

    // Render the appropriate chart type
    const renderChart = () => {
        if (!chartData) return null;

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
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
        };

        const chartProps = {
            ref: chartRef,
            data: chartData,
            options: {
                ...commonOptions,
                ...(chartType === 'bar' ? {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                } : {})
            }
        };

        switch (chartType) {
            case 'bar':
                return <Bar {...chartProps} />;
            case 'pie':
                return <Pie {...chartProps} />;
            case 'line':
                return <Line {...chartProps} />;
            default:
                return null;
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
                    className="w-full mb-4 border-4 border-light-blue-500"
                    placeholder="Describe the chart you want to generate (e.g.,' IPL 2020 Stats ' or 'Google Sales comparison for Q1 2024')"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <div className="flex items-center space-x-4 mb-4">
                    <Label>Chart Type:</Label>
                    <Select
                        value={chartType}
                        onValueChange={(value: ChartType) => setChartType(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select chart type" />
                        </SelectTrigger>
                        <SelectContent>
                            {CHART_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

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
                                <Label htmlFor="Label">Label</Label>
                                <Input
                                    id="Label Name"
                                    value={chartLabel}
                                    onChange={e => setChartSubTitle(e.target.value)}
                                />
                                <Label htmlFor="Color">Color</Label>
                                <Input
                                    id="Color"
                                    value={chartColor}
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
            </div>

            {error && (
                <div className="text-red-500 text-center w-full max-w-2xl">
                    {error}
                </div>
            )}
            {chartData && (
                <div className="w-full max-w-4xl h-[400px] mt-5">
                    {renderChart()}
                </div>
            )}
            <div className="w-full mt-10 h-[400px]">
                <Spline scene={sceneUrl} />
            </div>
        </div>

    );
};

export default GeneratePage;