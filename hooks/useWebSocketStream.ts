"use client";

import { useCallback, useRef, useState } from "react";

export interface ProgressUpdate {
    type: "progress";
    step: string;
    message: string;
}

export interface ResultMessage {
    type: "result";
    session_id: string;
    response_text: string;
    strategy?: any;
    compliance?: any;
}

export type WebSocketMessage = ProgressUpdate | ResultMessage;

interface UseWebSocketStreamOptions {
    onProgress?: (update: ProgressUpdate) => void;
    onResult?: (result: ResultMessage) => void;
    onError?: (error: Error) => void;
    onClose?: () => void;
}

export function useWebSocketStream() {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);

    const connect = useCallback(
        (sessionId: string, options: UseWebSocketStreamOptions = {}) => {
            // Close any existing connection
            if (wsRef.current) {
                wsRef.current.close();
            }

            // Always use secure WebSocket (wss://) - works on both HTTP and HTTPS pages
            const wsUrl = `wss://unfruity-hearted-kenzie.ngrok-free.dev/ws/chat/${sessionId}?token=aesthetics-secret-key-2025`;

            try {
                const ws = new WebSocket(wsUrl);
                wsRef.current = ws;

                ws.onopen = () => {
                    console.log("WebSocket connected");
                    setIsConnected(true);
                    setConnectionError(null);
                };

                ws.onmessage = (event) => {
                    try {
                        const message: WebSocketMessage = JSON.parse(event.data);

                        if (message.type === "progress" && options.onProgress) {
                            options.onProgress(message);
                        } else if (message.type === "result" && options.onResult) {
                            options.onResult(message);
                        }
                    } catch (error) {
                        console.error("Error parsing WebSocket message:", error);
                        if (options.onError) {
                            options.onError(new Error("Failed to parse message"));
                        }
                    }
                };

                ws.onerror = (error) => {
                    console.error("WebSocket error:", error);
                    setConnectionError("WebSocket connection error");
                    if (options.onError) {
                        options.onError(new Error("WebSocket connection error"));
                    }
                };

                ws.onclose = () => {
                    console.log("WebSocket disconnected");
                    setIsConnected(false);
                    if (options.onClose) {
                        options.onClose();
                    }
                };
            } catch (error) {
                console.error("Failed to create WebSocket:", error);
                setConnectionError("Failed to create WebSocket connection");
                if (options.onError) {
                    options.onError(error as Error);
                }
            }
        },
        []
    );

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
            setIsConnected(false);
        }
    }, []);

    return {
        connect,
        disconnect,
        isConnected,
        connectionError,
    };
}
