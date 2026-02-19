const http = require('http');

// 1. Mock Server (mimics route.ts)
const server = http.createServer((req, res) => {
  if (req.url === '/api/generate-content' && req.method === 'POST') {
    // Set headers for streaming
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    });

    console.log('Server: Connection started. Sending heartbeats...');

    // Simulate heartbeats
    let count = 0;
    const interval = setInterval(() => {
      res.write("  \n"); // Send whitespace heartbeat
      console.log('Server: Sent heartbeat');
      count++;

      // After 3 heartbeats (simulating 30s wait), send data
      if (count >= 3) {
        clearInterval(interval);
        const mockedResponse = JSON.stringify({
          response_text: "Validation Success!",
          strategy: "Streaming works",
          compliance: "Passed"
        });
        res.write(mockedResponse);
        res.end();
        console.log('Server: Sent JSON and closed connection.');
      }
    }, 1000); // 1s interval for test speed (instead of 10s)
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3030, async () => {
    console.log('Test Server running on port 3030');
    await runClient();
    server.close();
});

// 2. Mock Client (mimics content-agent.ts)
async function runClient() {
    console.log('\nClient: Starting request...');
    
    // In node, we can't use window.fetch, wait, I need to see if the user environment has fetch (Node 18+ does)
    // Assuming Node 18+
    try {
        const response = await fetch("http://localhost:3030/api/generate-content", {
            method: "POST",
            body: JSON.stringify({ test: "true" })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            console.log(`Client: Received chunk: "${chunk.replace(/\n/g, '\\n')}"`);
            result += chunk;
        }

        console.log(`\nClient: Full Raw Response: "${result.replace(/\n/g, '\\n')}"`);
        
        const trimmed = result.trim();
        console.log(`Client: Trimmed Response: "${trimmed}"`);

        try {
            const json = JSON.parse(trimmed);
            console.log("Client: JSON Parse Success:", json);
            if (json.response_text === "Validation Success!") {
                console.log("\n✅ VALIDATION PASSED: Handled streaming heartbeats correctly.");
            } else {
                console.log("\n❌ VALIDATION FAILED: Incorrect data.");
            }
        } catch (e) {
            console.log("\n❌ VALIDATION FAILED: JSON Parse Error", e);
        }

    } catch (err) {
        console.error("Client Error:", err);
    }
}
