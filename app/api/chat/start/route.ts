import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://unfruity-hearted-kenzie.ngrok-free.dev/chat/start";
const API_TOKEN = "aesthetics-secret-key-2025";

export async function POST(request: NextRequest) {
    try {
        // Get the request body from the client
        const body = await request.json();

        // Forward the request to the actual API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Token": API_TOKEN,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", response.status, errorText);
            return NextResponse.json(
                { error: "Failed to start chat job", details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in chat/start proxy:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}
