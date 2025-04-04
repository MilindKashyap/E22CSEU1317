import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/evaluation-service': {
        target: 'http://20.244.56.144',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          // Handle proxy errors
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
            
            // Prevent hanging on proxy errors
            if (!res.headersSent) {
              res.writeHead(500, {
                'Content-Type': 'application/json'
              });
              res.end(JSON.stringify({ 
                error: 'Proxy Error', 
                message: err.message 
              }));
            }
          });
          
          // Log outgoing requests
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
            
            // Ensure token is set in every outgoing request
            const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNzQ1NjUwLCJpYXQiOjE3NDM3NDUzNTAsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjNhMTc5MmNiLTI3NTUtNGMyNS1hYjgyLWU2ZDkwOGQ0NTA2ZiIsInN1YiI6ImUyMmNzZXUxMzE3QGJlbm5ldHQuZWR1LmluIn0sImVtYWlsIjoiZTIyY3NldTEzMTdAYmVubmV0dC5lZHUuaW4iLCJuYW1lIjoibWlsaW5kIGthc2h5YXAiLCJyb2xsTm8iOiJlMjJjc2V1MTMxNyIsImFjY2Vzc0NvZGUiOiJydENIWkoiLCJjbGllbnRJRCI6IjNhMTc5MmNiLTI3NTUtNGMyNS1hYjgyLWU2ZDkwOGQ0NTA2ZiIsImNsaWVudFNlY3JldCI6InNZZFdXVU1TVnNiblNXRmoifQ.YKb701t5qV6vQ1S4FRFErJhs4QOih5JM_RUiNJyQU-g';
            proxyReq.setHeader('Authorization', `Bearer ${authToken}`);
          });
          
          // Log incoming responses
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    },
    // Increase timeout to handle slow API responses
    hmr: {
      timeout: 5000
    }
  }
})
