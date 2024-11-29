import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const runtime = 'edge';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(request: NextRequest) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        const response = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [
                {
                    role: 'system',
                    content: 'Generate strict JSON for a bar or pie chart which is asked. ONLY return valid JSON in this exact format.'
                },
                {
                    role: 'user',
                    content: `Create chart data for: "${prompt}". 
JSON FORMAT REQUIRED:
{
  "labels": ["Label1", "Label2", "Label3"], 
  "datasets": [{
    "label": "Chart Title",
    "data": [10, 20, 30],
    "backgroundColor": ["rgba(75,192,192,0.6)", "rgba(255,99,132,0.6)", "rgba(54,162,235,0.6)"]
  }]
}`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content;
        const chartData = JSON.parse(content || '{}');
        return NextResponse.json(chartData);

    } catch (error) {
        return NextResponse.json({ 
            error: 'Chart generation failed', 
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ 
        message: 'POST request with prompt for chart data',
        usage: '{ "prompt": "description" }'
    }, { status: 200 });
}