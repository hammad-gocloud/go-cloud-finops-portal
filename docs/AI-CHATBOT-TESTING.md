# Testing Guide for AI Chatbot WebSocket Flow

## Quick Test Steps

### 1. Visual Test
1. Open your application in the browser
2. Look for the floating chat button (bottom-right corner)
3. Click the button to open the chatbot

### 2. Configuration Test
1. Fill in the form:
   - **Platform**: Select "Instagram"
   - **Topic**: Enter "Botox Safety"
   - **Query**: Enter "Make it reassuring"
2. Click "Start Chatting"

### 3. Monitor the Flow

#### Browser Console
You should see:
```
Job started: { message: "...", session_id: "...", websocket_url: "..." }
WebSocket connected
Progress: { type: "progress", step: "...", message: "..." }
Result: { type: "result", session_id: "...", response_text: "..." }
WebSocket closed
```

#### UI Updates
1. **Initial Request**: Loading spinner appears
2. **WebSocket Connected**: Progress box shows with pulsing indicator
3. **Progress Updates**: Steps appear one by one:
   ```
   🔵 Generating content...
     • Completed step: keywords
     • Completed step: content_generation
     • Completed step: compliance_check
   ```
4. **Final Result**: AI message appears with generated content

### 4. Expected Behavior

✅ **Success Path:**
- Form submission triggers HTTP request
- Session ID received
- WebSocket connects automatically
- Progress updates display in real-time
- Final content appears as a message
- WebSocket disconnects
- Progress indicator disappears

❌ **Error Cases:**

**HTTP Failure:**
- Error message: "Sorry, I encountered an error connecting to the Aesthetics Agent."
- No WebSocket connection attempted

**WebSocket Failure:**
- Error message: "WebSocket error: [error message]. Please try again."
- Previous progress preserved

## Network Tab Verification

### HTTP Request
1. Open DevTools → Network tab
2. Look for request to `http://3.24.210.190:8002/chat/start`
3. Check:
   - Method: POST
   - Headers include: `X-API-Token: aesthetics-secret-key-2025`
   - Request payload matches form data
   - Response contains `session_id`

### WebSocket Connection
1. In Network tab, filter by "WS" (WebSocket)
2. Look for connection to `ws://3.24.210.190:8002/ws/chat/[session_id]`
3. Click on the connection to see:
   - **Messages** tab: View incoming progress and result messages
   - **Frames** tab: See raw WebSocket frames

## Testing Different Scenarios

### Test 1: Basic Flow
```
Platform: Instagram
Topic: Botox Safety  
Query: Make it reassuring
```

### Test 2: Different Platform
```
Platform: TikTok
Topic: Skincare Routine
Query: Create engaging content
```

### Test 3: Long Topic
```
Platform: Facebook
Topic: Comprehensive Guide to Anti-Aging Treatments
Query: Make it educational and professional
```

### Test 4: Multiple Messages
1. Complete first generation
2. Type follow-up message: "Make it shorter"
3. Send
4. Observe new WebSocket connection with new session

## Debugging Checklist

### If WebSocket Doesn't Connect

- [ ] Check if `session_id` was received from HTTP response
- [ ] Verify API is accessible at `http://3.24.210.190:8002`
- [ ] Check browser console for WebSocket errors
- [ ] Ensure token is correct in both HTTP and WebSocket requests
- [ ] Review Network tab for connection attempts

### If Progress Doesn't Show

- [ ] Check `progressSteps` state in React DevTools
- [ ] Verify `isStreaming` is `true`
- [ ] Check incoming WebSocket messages format
- [ ] Look for message parsing errors in console

### If Final Result Missing

- [ ] Check if WebSocket receives `result` type message
- [ ] Verify `response_text` field exists
- [ ] Check for errors in onResult callback
- [ ] Ensure WebSocket stays connected until result arrives

## Performance Metrics

### Expected Timings
- **HTTP Request**: < 500ms
- **WebSocket Connection**: < 200ms
- **Progress Updates**: 1-3 seconds between steps
- **Final Result**: 5-15 seconds total (depending on content complexity)

## React DevTools Inspection

### Component Structure
```
AIChatbot
  └─ Uses useChatbot hook
      ├─ messages: ChatMessage[]
      ├─ isLoading: boolean
      ├─ isStreaming: boolean
      ├─ progressSteps: ProgressUpdate[]
      └─ isConnected: boolean
```

### State Timeline
1. **Initial**: All states default/empty
2. **Form Submit**: `isLoading = true`
3. **HTTP Success**: `isStreaming = true`, `isConnected = true`
4. **Progress Updates**: `progressSteps` array grows
5. **Result Received**: New message added, `isStreaming = false`
6. **Complete**: `isConnected = false`

## Common Issues

### CORS Errors
If you see CORS errors:
- Backend must allow origin from your Next.js app
- WebSocket upgrade headers must be allowed
- Token must be in query parameter (not header) for WebSocket

### Connection Timeout
If WebSocket takes too long:
- Check server is running
- Verify network connectivity
- Ensure session_id is valid
- Backend should accept connection immediately

### Message Format Errors
If progress/results don't parse:
- Backend must send valid JSON
- Message types must be "progress" or "result"
- Field names must match exactly

## Success Indicators

✅ **Everything Working:**
1. Form submits without errors
2. Console shows "WebSocket connected"
3. Progress box appears with pulsing dot
4. Steps appear incrementally
5. Final message contains generated content
6. Console shows "WebSocket closed"
7. Can send follow-up messages

## Next Steps After Testing

If tests pass:
- [ ] Test edge cases (network failures, server errors)
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Monitor performance under load
- [ ] Add telemetry/analytics

If tests fail:
- [ ] Review console errors
- [ ] Check network requests
- [ ] Verify backend is running
- [ ] Validate API token
- [ ] Review this testing guide
