"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface ChatMessageProps {
    message: ChatMessage;
}

export function ChatMessageComponent({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <div
            className={cn(
                "flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            {!isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
            )}

            <div
                className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2.5",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                )}
            >
                <div className="text-sm">
                    <ReactMarkdown
                        components={{
                            p: ({ ...props }) => <p className="whitespace-pre-wrap break-words mb-2 last:mb-0" {...props} />,
                            h1: ({ ...props }) => <h1 className="font-bold text-lg mb-2 mt-4 first:mt-0" {...props} />,
                            h2: ({ ...props }) => <h2 className="font-semibold text-base mb-2 mt-3 first:mt-0" {...props} />,
                            h3: ({ ...props }) => <h3 className="font-semibold text-sm mb-1 mt-3 first:mt-0 underline decoration-dotted" {...props} />,
                            ul: ({ ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                            ol: ({ ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                            li: ({ ...props }) => <li className="pl-1" {...props} />,
                            strong: ({ ...props }) => <strong className="font-bold" {...props} />,
                            blockquote: ({ ...props }) => <blockquote className="border-l-2 pl-4 italic opacity-80 my-2" {...props} style={{ borderColor: 'currentColor' }} />,
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>
                <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>

            {isUser && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <User className="w-5 h-5 text-secondary-foreground" />
                </div>
            )}
        </div>
    );
}

export function TypingIndicator() {
    return (
        <div className="flex gap-3 mb-4 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"></div>
                </div>
            </div>
        </div>
    );
}
