# AI Chatbot - Technical Architecture

## Component Hierarchy

```
AIChatbot (Main Component)
│
├── [State: isOpen, isExpanded, platform, topic, question]
│
└── useChatbot Hook
    │
    ├── [State: messages, input, config, progressSteps, isStreaming]
    │
    ├── useContentGeneration Hook (HTTP)
    │   └── POST /chat/start → Returns session_id
    │
    └── useWebSocketStream Hook (WebSocket)
        └── ws://.../{session_id} → Streams progress & result
```

## Data Flow

### Step-by-Step Execution

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USER INTERACTION                                         │
├─────────────────────────────────────────────────────────────┤
│ User fills form:                                            │
│   - Platform: Instagram                                     │
│   - Topic: "Botox Safety"                                   │
│   - Query: "Make it reassuring"                             │
│                                                             │
│ User clicks "Start Chatting"                                │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. STATE UPDATE                                             │
├─────────────────────────────────────────────────────────────┤
│ startChat() called                                          │
│   → setConfig({ platform, topic, question })               │
│   → setMessages([]) // Clear previous                       │
│   → sendMessage(question, config) // First message          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. HTTP REQUEST (Step 1)                                    │
├─────────────────────────────────────────────────────────────┤
│ POST http://3.24.210.190:8002/chat/start                    │
│                                                             │
│ Headers:                                                    │
│   Content-Type: application/json                            │
│   X-API-Token: aesthetics-secret-key-2025                   │
│                                                             │
│ Body:                                                       │
│   {                                                         │
│     platform: "Instagram",                                  │
│     topic: "Botox Safety",                                  │
│     query: "Make it reassuring",                            │
│     session_id: "job_1702645890123"                         │
│   }                                                         │
│                                                             │
│ Response:                                                   │
│   {                                                         │
│     message: "Job started successfully...",                 │
│     session_id: "session_uuid_12345",                       │
│     websocket_url: "/ws/chat/session_uuid_12345"            │
│   }                                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. STATE UPDATE                                             │
├─────────────────────────────────────────────────────────────┤
│ setIsStreaming(true)                                        │
│ setProgressSteps([])                                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. WEBSOCKET CONNECTION (Step 2)                            │
├─────────────────────────────────────────────────────────────┤
│ connect(session_id, callbacks)                              │
│                                                             │
│ URL: ws://3.24.210.190:8002/ws/chat/session_uuid_12345     │
│      ?token=aesthetics-secret-key-2025                      │
│                                                             │
│ Events:                                                     │
│   - onopen  → setIsConnected(true)                         │
│   - onmessage → Parse and route message                     │
│   - onerror → Handle error                                  │
│   - onclose → setIsConnected(false)                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. PROGRESS UPDATES (Streaming)                             │
├─────────────────────────────────────────────────────────────┤
│ Server sends multiple messages:                             │
│                                                             │
│ Message 1:                                                  │
│   { type: "progress", step: "keywords",                     │
│     message: "Completed step: keywords" }                   │
│   → onProgress() → setProgressSteps([...prev, update])     │
│                                                             │
│ Message 2:                                                  │
│   { type: "progress", step: "content_generation",           │
│     message: "Completed step: content_generation" }         │
│   → onProgress() → setProgressSteps([...prev, update])     │
│                                                             │
│ Message 3:                                                  │
│   { type: "progress", step: "compliance",                   │
│     message: "Completed step: compliance" }                 │
│   → onProgress() → setProgressSteps([...prev, update])     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. FINAL RESULT                                             │
├─────────────────────────────────────────────────────────────┤
│ Server sends final message:                                 │
│   {                                                         │
│     type: "result",                                         │
│     session_id: "session_uuid_12345",                       │
│     response_text: "# Slide 1: Why Botox is Safe\n...",    │
│     strategy: { ... },                                      │
│     compliance: { ... }                                     │
│   }                                                         │
│                                                             │
│ onResult() called:                                          │
│   → setIsStreaming(false)                                   │
│   → setMessages([...prev, aiMessage])                       │
│   → disconnect()                                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. UI UPDATE                                                │
├─────────────────────────────────────────────────────────────┤
│ - Progress indicator disappears                             │
│ - AI message appears in chat                                │
│ - WebSocket status: disconnected                            │
│ - User can send follow-up messages                          │
└─────────────────────────────────────────────────────────────┘
```

## State Transitions

### isLoading State
```
false → [HTTP Request Start] → true → [HTTP Response] → false/streaming
```

### isStreaming State
```
false → [WebSocket Connect] → true → [Result Received] → false
```

### progressSteps State
```
[] → [Progress 1] → [1] → [Progress 2] → [1, 2] → [Progress N] → [1, 2, ..., N]
   → [Clear Chat] → []
```

### messages State
```
[] → [User Message] → [UserMsg] → [AI Result] → [UserMsg, AIMsg]
   → [Follow-up] → [UserMsg, AIMsg, UserMsg2] → ...
```

## Hook Dependencies

```typescript
sendMessage() depends on:
  └─ isLoading (prevent duplicate sends)
  └─ config (current chat configuration)
  └─ generateAsync() (from useContentGeneration)
  └─ connect() (from useWebSocketStream)
  └─ disconnect() (from useWebSocketStream)

startChat() depends on:
  └─ sendMessage() (to send initial message)

clearChat() depends on:
  └─ disconnect() (to close WebSocket)
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│ HTTP Error                                                  │
├─────────────────────────────────────────────────────────────┤
│ fetch() throws                                              │
│   ↓                                                         │
│ catch block                                                 │
│   ↓                                                         │
│ setIsStreaming(false)                                       │
│   ↓                                                         │
│ Add error message to chat                                   │
│   ↓                                                         │
│ User can retry                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ WebSocket Error                                             │
├─────────────────────────────────────────────────────────────┤
│ ws.onerror triggered                                        │
│   ↓                                                         │
│ onError() callback                                          │
│   ↓                                                         │
│ setIsStreaming(false)                                       │
│   ↓                                                         │
│ Add error message to chat                                   │
│   ↓                                                         │
│ disconnect()                                                │
│   ↓                                                         │
│ User can retry                                              │
└─────────────────────────────────────────────────────────────┘
```

## UI Rendering Logic

```typescript
{!isConfigured ? (
  // Show setup form
  <SetupForm />
) : (
  // Show chat interface
  <>
    <Messages>
      {messages.map(...)}  // Previous messages
      
      {isStreaming && progressSteps.length > 0 && (
        // Progress indicator with live updates
        <ProgressBox steps={progressSteps} />
      )}
      
      {isLoading && !isStreaming && (
        // Generic loading (HTTP in progress)
        <TypingIndicator />
      )}
    </Messages>
    
    <InputArea disabled={isLoading} />
  </>
)}
```

## WebSocket Lifecycle

```
[Component Mount]
        ↓
[User submits form]
        ↓
[HTTP returns session_id]
        ↓
[connect(sessionId)]
        ↓
[new WebSocket(url)] ──┐
        ↓              │
[ws.onopen]            │
        ↓              │
[isConnected = true]   │
        ↓              │
[Receive messages] ◄───┘
        ↓
[type: "progress"] → onProgress() → Update UI
        ↓
[type: "result"] → onResult() → Add message → disconnect()
        ↓
[ws.close()]
        ↓
[ws.onclose]
        ↓
[isConnected = false]
```

## Message Flow in useChatbot

```typescript
// Incoming flow
WebSocket Message
        ↓
Parse JSON
        ↓
type === "progress" ? onProgress : onResult
        ↓
State Update (setProgressSteps or setMessages)
        ↓
Component Re-render
        ↓
UI Update (Progress indicator or Message bubble)
```

## Performance Considerations

### Preventing Re-renders
- `useCallback` for all event handlers
- Memoized callbacks in WebSocket options
- Separate `isLoading` and `isStreaming` states

### Memory Management
- WebSocket cleanup in useEffect
- Disconnect on unmount
- Clear state on new chat

### State Updates
- Functional updates for arrays: `(prev) => [...prev, new]`
- Batched updates in React 18+
- Minimal re-renders with proper dependencies

## Security Notes

### API Token
- Stored in code (should be in `.env` for production)
- Required in both HTTP header and WebSocket query param
- `X-API-Token: aesthetics-secret-key-2025`

### WebSocket Authentication
- Token in query string (WebSocket doesn't support custom headers)
- Server should validate on connection
- Connection should be closed if invalid token

### Data Validation
- All WebSocket messages parsed with try/catch
- Type checking on message format
- Graceful fallback on parsing errors

## Testing Hooks

### Test Points
1. ✓ HTTP request sends correct data
2. ✓ Session ID extraction
3. ✓ WebSocket connection with session ID
4. ✓ Progress updates accumulate
5. ✓ Final result creates message
6. ✓ WebSocket disconnects after result
7. ✓ Error handling for both HTTP and WS
8. ✓ State cleanup on clearChat()

## Future Optimizations

### Potential Improvements
- [ ] Exponential backoff for retries
- [ ] WebSocket reconnection logic
- [ ] Message queue for offline support
- [ ] Progress percentage calculation
- [ ] Estimated time remaining
- [ ] Cancel ongoing generation
- [ ] Rate limiting on client side
