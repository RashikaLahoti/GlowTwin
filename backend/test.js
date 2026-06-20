import { server } from './src/app.js';

async function runTests() {
  console.log('[Test Suite] Starting tests on Express server...');
  
  try {
    const res = await fetch('http://localhost:5000/health');
    const json = await res.json();
    console.log('[Test Suite] /health response:', res.status, json);
    
    if (res.status === 200 && json.status === 'ok') {
      console.log('[Test Suite] Health check passed!');
    } else {
      console.error('[Test Suite] Health check failed!');
      process.exit(1);
    }
  } catch (error) {
    console.error('[Test Suite] Server check failed:', error.message);
    process.exit(1);
  } finally {
    console.log('[Test Suite] Tearing down server...');
    server.close(() => {
      console.log('[Test Suite] Server stopped. Exit.');
      process.exit(0);
    });
  }
}

// Give server and MongoDB connection 2 seconds to establish
setTimeout(runTests, 2000);
