# AI Chatbot Content Generation - WebSocket Flow

## Overview

This implementation provides a comprehensive flow for AI-powered content generation using a combination of HTTP requests and WebSocket streaming.

## Architecture

### Flow Diagram

```
User Click "Generate"
        ↓
[Step 1] HTTP POST /chat/start
        ↓
   Get session_id
        ↓
[Step 2] WebSocket Connection
        ↓
   Stream Progress Updates
        ↓
   Receive Final Result
```

## Components

### 1. `useContentGeneration` Hook
**Location:** `hooks/useContentGeneration.ts`

- Handles the initial HTTP POST request to start the job
- **Endpoint:** `POST http://3.24.210.190:8002/chat/start`
- **Headers:**
  - `Content-Type: application/json`
  - `X-API-Token: aesthetics-secret-key-2025`

**Request Body:**
```json
{
  "topic": "Botox Safety",
  "query": "Make it reassuring",
  "platform": "Instagram",
  "session_id": "job_001"
}
```

**Response:**
```json
{
  "message": "Job started successfully...",
  "session_id": "session_uuid_12345",
  "websocket_url": "/ws/chat/session_uuid_12345"
}
```

### 2. `useWebSocketStream` Hook
**Location:** `hooks/useWebSocketStream.ts`

- Manages WebSocket connections for streaming results
- **URL:** `ws://3.24.210.190:8002/ws/chat/{session_id}?token=aesthetics-secret-key-2025`
- **Technology:** Native WebSocket API (not socket.io)

**Features:**
- Auto-connect on session start
- Progress tracking
- Error handling
- Connection state management

**Incoming Message Types:**

1. **Progress Update:**
```json
{
  "type": "progress",
  "step": "keywords",
  "message": "Completed step: keywords"
}
```

2. **Final Result:**
```json
{
  "type": "result",
  "session_id": "...",
  "response_text": "# Slide 1: ...",
  "strategy": { ... },
  "compliance": { ... }
}
```

### 3. `useChatbot` Hook
**Location:** `hooks/useChatbot.ts`

Orchestrates the entire flow:
- Manages chat state (messages, input, config)
- Coordinates HTTP request and WebSocket streaming
- Handles progress tracking
- Error management

**Key Features:**
- Progress step accumulation
- Streaming state management
- Auto-disconnect on completion
- Error recovery

### 4. `AIChatbot` Component
**Location:** `components/ai-chatbot.tsx`

User interface for the chatbot:
- Configuration form (platform, topic, query)
- Message display
- Real-time progress indicator
- Responsive design

## Usage

### Basic Usage

```tsx
import { AIChatbot } from "@/components/ai-chatbot";

export default function Page() {
  return <AIChatbot />;
}
```

The component handles everything internally:
1. User fills in the form (Platform, Topic, Question)
2. Clicks "Start Chatting"
3. System starts HTTP request
4. Connects to WebSocket automatically
5. Shows real-time progress
6. Displays final result

### Progress Tracking

The progress indicator shows:
- Current streaming status
- Completed steps
- Real-time updates

Example progress display:
```
🔵 Generating content...
  • Completed step: keywords
  • Completed step: content_generation
  • Completed step: compliance_check
```

## State Management

### Chat States
- `messages`: Array of user and AI messages
- `isLoading`: HTTP request in progress
- `isStreaming`: WebSocket streaming in progress
- `progressSteps`: Array of completed steps
- `isConnected`: WebSocket connection status

### Message Types
```typescript
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
```

## Error Handling

### HTTP Errors
- Network failures
- Invalid responses
- Missing session_id

### WebSocket Errors
- Connection failures
- Message parsing errors
- Unexpected disconnections

All errors display user-friendly messages in the chat interface.

## Configuration

### Supported Platforms
- Instagram
- Twitter
- TikTok
- Facebook

### Session Management
- Unique session IDs generated per request
- Format: `job_${timestamp}`
- Auto-cleanup on completion

## Technical Notes

### Why Native WebSocket?
- No socket.io dependency needed
- Lighter weight
- Direct browser WebSocket API
- Simpler implementation for one-way streaming

### Auto-disconnect
WebSocket automatically disconnects:
- After receiving final result
- On error
- When clearing chat
- On component unmount

### Progress Accumulation
Progress steps are accumulated (not replaced) to show the full journey:
```typescript
setProgressSteps((prev) => [...prev, update]);
```

## API Endpoints

### Production
- **HTTP:** `http://3.24.210.190:8002/chat/start`
- **WebSocket:** `ws://3.24.210.190:8002/ws/chat/{session_id}?token=aesthetics-secret-key-2025`

### Authentication
All requests require the API token:
```
X-API-Token: aesthetics-secret-key-2025
```

## Development

### Running the Application
```bash
npm run dev
```

### Testing WebSocket Connection
Check browser console for:
- "WebSocket connected"
- "Progress: ..." logs
- "Result: ..." logs

### Debugging
Enable verbose logging in the browser console to see:
1. Job start response
2. WebSocket connection status
3. Progress updates
4. Final results
5. Any errors

## Future Enhancements

Potential improvements:
- [ ] Retry logic for failed connections
- [ ] Reconnection on disconnect
- [ ] Message history persistence
- [ ] Multiple concurrent sessions
- [ ] Export conversation
- [ ] Voice input/output
- [ ] Rich media support in responses

## Troubleshooting

### WebSocket Won't Connect
- Check network connectivity
- Verify session_id is received from HTTP request
- Ensure token is correct
- Check browser console for errors

### Progress Not Showing
- Verify WebSocket messages match expected format
- Check `progressSteps` state in React DevTools
- Ensure `isStreaming` is true

### No Final Result
- Check WebSocket remains connected
- Verify backend sends `result` type message
- Look for error messages in console
