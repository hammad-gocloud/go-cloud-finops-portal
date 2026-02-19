"use client";

import { useContentGeneration } from "@/hooks/useContentGeneration";
import { useEffect } from "react";
import { useChatbot } from "@/hooks/useChatbot"; // For SocialPlatform type if needed, or import from service

export function ContentGeneratorExample() {
    const { generate, data, isLoading, isError, error, regenerate } = useContentGeneration();

    useEffect(() => {
        // Example: Auto-generate on mount
        generate({
            platform: "twitter",
            topic: "Typescript Tips",
            query: "Write a thread about advanced types",
            session_id: "demo-session-123"
        });
    }, []);

    if (isLoading) return <div>Generating content...</div>;
    if (isError) return <div>Error: {String(error)}</div>;

    return (
        <div className="p-4 border rounded-lg max-w-2xl mx-auto my-8">
            <h2 className="text-xl font-bold mb-4">Aesthetics Content Result</h2>

            {data && (
                <div className="space-y-6">
                    <section>
                        <h3 className="font-semibold text-lg border-b pb-2 mb-2">Response Text</h3>
                        <p className="whitespace-pre-wrap">{data.response_text}</p>
                    </section>

                    <section className="bg-slate-50 p-4 rounded-md">
                        <h3 className="font-semibold text-blue-600 mb-2">Strategy</h3>
                        <p className="text-sm text-slate-700">{data.strategy}</p>
                    </section>

                    <section className="bg-green-50 p-4 rounded-md border border-green-100">
                        <h3 className="font-semibold text-green-700 mb-2">Compliance</h3>
                        <p className="text-sm text-green-800">{data.compliance}</p>
                    </section>

                    <button
                        onClick={() => regenerate()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Regenerate
                    </button>
                </div>
            )}
        </div>
    );
}
