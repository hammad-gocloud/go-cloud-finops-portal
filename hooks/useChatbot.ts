"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/chat-message";
import useContentGeneration from "./useContentGeneration";
import { useWebSocketStream, ProgressUpdate, ResultMessage } from "./useWebSocketStream";
export type SocialPlatform =
  | 'instagram'
  | 'twitter'
  | 'tiktok'
  | 'facebook';

export interface ChatConfig {
  platform: SocialPlatform;
  topic: string;
  question: string;
}

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressUpdate[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: generateAsync, isPending: isLoading } = useContentGeneration();
  const { connect, disconnect, isConnected } = useWebSocketStream();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (content: string, chatConfig?: ChatConfig) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      // Add user message
      setMessages((prev) => [...prev, userMessage]);
      // Only clear input if it was sent via the input field (not initial config)
      if (!chatConfig) {
        setInput("");
      }

      // Use current config or the one passed in (for startChat)
      const currentConfig = chatConfig || config;

      if (!currentConfig) {
        // Should not happen if flow is correct, but safety net
        return;
      }

      try {
        // Clear previous progress
        setProgressSteps([]);
        setIsStreaming(true);

        // STEP 1: Start the job (HTTP)
        const response = await generateAsync({
          platform: currentConfig.platform,
          topic: currentConfig.topic,
          query: content,
          session_id: `job_${Date.now()}` // Generate unique session ID
        });

        console.log("Job started:", response);
        const sessionId = response.session_id;

        if (!sessionId) {
          throw new Error("No session_id received from server");
        }

        // STEP 2: Connect to WebSocket for streaming
        connect(sessionId, {
          onProgress: (update: ProgressUpdate) => {
            console.log("Progress:", update);
            setProgressSteps((prev) => [...prev, update]);
          },
          onResult: (result: ResultMessage) => {
            console.log("Result:", result);
            setIsStreaming(false);

            // Add AI response message
            const aiMessage: ChatMessage = {
              id: `ai-${Date.now()}`,
              role: "assistant",
              content: result.response_text,
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiMessage]);

            // Disconnect WebSocket after receiving result
            disconnect();
          },
          onError: (error: Error) => {
            console.error("WebSocket error:", error);
            setIsStreaming(false);

            const errorMessage: ChatMessage = {
              id: `error-${Date.now()}`,
              role: "assistant",
              content: `WebSocket error: ${error.message}. Please try again.`,
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, errorMessage]);
            disconnect();
          },
          onClose: () => {
            console.log("WebSocket closed");
            setIsStreaming(false);
          }
        });

      } catch (error) {
        console.error("Error getting AI response:", error);
        setIsStreaming(false);

        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error connecting to the Aesthetics Agent. Please try again.",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    },
    [isLoading, config, generateAsync, connect, disconnect]
  );

  const startChat = useCallback((newConfig: ChatConfig) => {
    setConfig(newConfig);
    setMessages([]); // Clear previous messages
    // Send the initial question as the first message
    sendMessage(newConfig.question, newConfig);
  }, [sendMessage]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setConfig(null); // Reset config to go back to setup screen
    setProgressSteps([]);
    setIsStreaming(false);
    disconnect(); // Disconnect WebSocket
  }, [disconnect]);

  return {
    messages,
    isLoading: isLoading || isStreaming,
    input,
    setInput,
    sendMessage,
    startChat,
    clearChat,
    messagesEndRef,
    isConfigured: !!config,
    progressSteps,
    isStreaming,
    isConnected,
  };
}
