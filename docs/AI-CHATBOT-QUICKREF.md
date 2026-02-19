# AI Chatbot - Quick Reference

## 🚀 Quick Start

```tsx
import { AIChatbot } from "@/components/ai-chatbot";

// Just add the component - it handles everything!
export default function Page() {
  return <AIChatbot />;
}
```

## 📊 The Flow (2 Steps)

### Step 1: HTTP Request
```
POST http://3.24.210.190:8002/chat/start
Headers: X-API-Token: aesthetics-secret-key-2025
Body: { topic, query, platform, session_id }
Response: { session_id, ... }
```

### Step 2: WebSocket Stream
```
ws://3.24.210.190:8002/ws/chat/{session_id}?token=aesthetics-secret-key-2025
Receives: progress updates → final result
```

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `hooks/useContentGeneration.ts` | HTTP POST to start job |
| `hooks/useWebSocketStream.ts` | WebSocket connection & streaming |
| `hooks/useChatbot.ts` | Orchestrates the entire flow |
| `components/ai-chatbot.tsx` | UI component |

## 🔧 Hook Usage

### useWebSocketStream

```typescript
const { connect, disconnect, isConnected } = useWebSocketStream();

// Connect
connect(sessionId, {
  onProgress: (update) => console.log(update),
  onResult: (result) => console.log(result),
  onError: (error) => console.error(error),
  onClose: () => console.log("Closed")
});

// Disconnect
disconnect();
```

### useChatbot

```typescript
const {
  messages,           // Array of chat messages
  isLoading,          // HTTP + WebSocket in progress
  isStreaming,        // WebSocket actively streaming
  progressSteps,      // Array of progress updates
  input,              // Current input value
  setInput,           // Update input
  sendMessage,        // Send a message
  startChat,          // Initialize chat with config
  clearChat,          // Reset everything
  messagesEndRef,     // Ref for auto-scroll
  isConfigured,       // Has config been set?
  isConnected         // WebSocket connected?
} = useChatbot();
```

## 📡 WebSocket Messages

### Progress Update
```json
{
  "type": "progress",
  "step": "keywords",
  "message": "Completed step: keywords"
}
```

### Final Result
```json
{
  "type": "result",
  "session_id": "...",
  "response_text": "# Generated content...",
  "strategy": {},
  "compliance": {}
}
```

## 🎨 UI States

| State | Display |
|-------|---------|
| Not configured | Setup form (Platform, Topic, Query) |
| Loading (HTTP) | Typing indicator |
| Streaming (WS) | Progress box with pulsing dot + steps |
| Has messages | Message bubbles |
| Error | Error message in chat |

## 🐛 Common Issues

### WebSocket won't connect
```typescript
// Check if session_id exists
console.log("Session ID:", sessionId);

// Verify WebSocket URL
console.log("WS URL:", `ws://.../${sessionId}?token=...`);
```

### Progress not showing
```typescript
// Check state
console.log("isStreaming:", isStreaming);
console.log("progressSteps:", progressSteps);

// Verify message format
ws.onmessage = (event) => {
  console.log("Raw message:", event.data);
  const parsed = JSON.parse(event.data);
  console.log("Type:", parsed.type);
};
```

### Multiple connections
```typescript
// Always disconnect before starting new chat
disconnect();

// Or check in useEffect cleanup
useEffect(() => {
  return () => disconnect();
}, []);
```

## 🔍 Debugging

### Browser Console
```javascript
// Enable verbose logging
localStorage.setItem('debug', 'websocket,http');

// Check WebSocket in Network tab
// Filter: WS
// Click connection → Messages tab
```

### React DevTools
```
useChatbot hook state:
  ├─ messages: ChatMessage[] (length)
  ├─ isLoading: boolean
  ├─ isStreaming: boolean
  ├─ progressSteps: ProgressUpdate[] (length)
  └─ isConnected: boolean
```

## ⚡ Performance Tips

1. **Prevent Memory Leaks**
   ```typescript
   useEffect(() => {
     return () => disconnect(); // Cleanup
   }, [disconnect]);
   ```

2. **Optimize Re-renders**
   ```typescript
   // Use functional updates
   setProgressSteps((prev) => [...prev, update]);
   
   // Not setProgressSteps([...progressSteps, update]);
   ```

3. **Batch State Updates**
   ```typescript
   // React 18 auto-batches, but ensure callbacks are memoized
   const onProgress = useCallback((update) => {
     setProgressSteps(prev => [...prev, update]);
   }, []);
   ```

## 📝 Environment Variables (TODO)

For production, move secrets to `.env`:

```bash
# .env.local
NEXT_PUBLIC_AI_API_URL=http://3.24.210.190:8002
NEXT_PUBLIC_AI_WS_URL=ws://3.24.210.190:8002
AI_API_TOKEN=aesthetics-secret-key-2025
```

Then update code:
```typescript
const API_URL = process.env.NEXT_PUBLIC_AI_API_URL;
const WS_URL = process.env.NEXT_PUBLIC_AI_WS_URL;
const TOKEN = process.env.AI_API_TOKEN;
```

## 🧪 Test Checklist

- [ ] Form submission works
- [ ] HTTP request successful
- [ ] WebSocket connects
- [ ] Progress updates appear
- [ ] Final result displays
- [ ] WebSocket disconnects
- [ ] Can send follow-up messages
- [ ] Clear chat resets state
- [ ] Errors handled gracefully
- [ ] Works on mobile

## 📚 Documentation

- **Architecture**: `docs/AI-CHATBOT-ARCHITECTURE.md`
- **Flow Details**: `docs/AI-CHATBOT-FLOW.md`
- **Testing Guide**: `docs/AI-CHATBOT-TESTING.md`

## 🆘 Getting Help

1. Check browser console for errors
2. Review Network tab (both HTTP and WS)
3. Inspect React state with DevTools
4. Verify backend is running
5. Check API token is correct
6. Review documentation files

## 💡 Tips

- **WebSocket = Native API**: No socket.io needed
- **Auto-disconnect**: Happens after result or error
- **Progress Accumulates**: Steps are added, not replaced
- **Session IDs**: Unique per request (`job_${timestamp}`)
- **Platform Flexible**: Supports Instagram, Twitter, TikTok, Facebook

## 🔐 Security Notes

⚠️ **Important**:
- API token is currently in code
- Move to environment variables for production
- Never commit secrets to git
- Use server-side API routes for sensitive operations

## 🎯 Next Steps

For your implementation:
1. Test the basic flow
2. Monitor console logs
3. Check Network tab
4. Verify progress updates
5. Confirm final result appears
6. Test error scenarios
7. Test on mobile
8. Move to environment variables
