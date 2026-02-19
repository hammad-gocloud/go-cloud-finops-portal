"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Trash2, ArrowRight, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageComponent, TypingIndicator } from "@/components/chat-message";
import { useChatbot, ChatConfig, SocialPlatform } from "@/hooks/useChatbot";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const {
        messages,
        isLoading,
        input,
        setInput,
        sendMessage,
        clearChat,
        messagesEndRef,
        startChat,
        isConfigured,
        progressSteps,
        isStreaming,
    } = useChatbot();

    // Setup form state
    const [platform, setPlatform] = useState<SocialPlatform>("instagram");
    const [topic, setTopic] = useState("");
    const [question, setQuestion] = useState("");

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const handleStartChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || !question.trim()) return;

        startChat({
            platform,
            topic: topic.trim(),
            question: question.trim()
        });
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-all duration-300 z-50",
                    "hover:scale-110 active:scale-95",
                    isOpen && "scale-0 opacity-0"
                )}
                size="icon"
                aria-label="Open AI Chatbot"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>

            {/* Chat Drawer */}
            <div
                className={cn(
                    "fixed bottom-0 right-0 z-50 transition-all duration-300 ease-in-out",
                    "flex flex-col bg-card border-l border-t border-border shadow-2xl",
                    // Desktop
                    "md:bottom-6 md:right-6 md:rounded-lg md:border",
                    // Mobile
                    "w-full h-[85vh]",
                    // Dynamic Size based on expansion
                    isExpanded
                        ? "md:w-[800px] md:h-[80vh]"
                        : "md:w-[400px] md:h-[600px]",
                    // Animation
                    isOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full md:translate-y-0 md:translate-x-full opacity-0 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-primary/5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-sm">AI Assistant</h3>
                            <p className="text-xs text-muted-foreground">Content Generator</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="h-8 w-8 hidden md:flex"
                            aria-label={isExpanded ? "Minimize" : "Maximize"}
                            title={isExpanded ? "Mxinimze" : "Maximize"}
                        >
                            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                        {isConfigured && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={clearChat}
                                className="h-8 w-8"
                                aria-label="Clear chat"
                                title="Start New Chat"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            className="h-8 w-8"
                            aria-label="Close chat"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {!isConfigured ? (
                    // SETUP FORM
                    <ScrollArea className="flex-1 p-6">
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <h2 className="text-lg font-semibold">Start a New Session</h2>
                                <p className="text-sm text-muted-foreground">
                                    Configure your content generation settings
                                </p>
                            </div>

                            <form onSubmit={handleStartChat} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="platform">Platform</Label>
                                    <Select
                                        value={platform}
                                        onValueChange={(value: SocialPlatform) => setPlatform(value)}
                                    >
                                        <SelectTrigger id="platform">
                                            <SelectValue placeholder="Select platform" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="instagram">Instagram</SelectItem>
                                            <SelectItem value="twitter">Twitter</SelectItem>
                                            <SelectItem value="tiktok">TikTok</SelectItem>
                                            <SelectItem value="facebook">Facebook</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="topic">Topic</Label>
                                    <Input
                                        id="topic"
                                        placeholder="E.g., Tech Trends, travel..."
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="question">Your Question / Request</Label>
                                    <Textarea
                                        id="question"
                                        placeholder="Describe what you want to generate..."
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        className="min-h-[100px]"
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full gap-2">
                                    Start Chatting
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </ScrollArea>
                ) : (
                    // CHAT INTERFACE
                    <>
                        {/* Messages Area */}
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <ChatMessageComponent key={message.id} message={message} />
                                ))}

                                {/* Progress Indicator */}
                                {isStreaming && progressSteps.length > 0 && (
                                    <div className="flex flex-col gap-2 p-4 rounded-lg bg-primary/5 border border-primary/20">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            <span className="text-sm font-medium text-primary">Generating content...</span>
                                        </div>
                                        <div className="space-y-1 ml-4">
                                            {progressSteps.map((step, index) => (
                                                <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                                                    <span>{step.message}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {isLoading && !isStreaming && <TypingIndicator />}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Input Area */}
                        <div className="p-4 border-t border-border bg-background">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleInputKeyDown}
                                    placeholder="Type your message..."
                                    disabled={isLoading}
                                    className="flex-1"
                                    autoFocus={isOpen}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || isLoading}
                                    className="flex-shrink-0"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </form>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                Press Enter to send • Esc to close
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
