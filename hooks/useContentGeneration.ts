import { useMutation } from "@tanstack/react-query";
import { SocialPlatform } from "./useChatbot";


export type ChatConfig = {
  platform: SocialPlatform;
  topic: string;
  query: string;
  session_id: string;
}
export default function useContentGeneration() {
  return useMutation({
    mutationFn: async (config: ChatConfig) => {
      // Use Next.js API route as proxy to bypass CORS
      const response = await fetch("/api/chat/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to generate content");
      }
      return response.json();
    },
  });
}