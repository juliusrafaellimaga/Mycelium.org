/**
 * Mycelium.org - Main Server
 * Express.js REST API server with agent management
 */

const express = require('express');
const path = require('path');
const agentRoutes = require('./api/routes');
const inquiryRoutes = require('./api/inquiries');
const { requestLogger, corsMiddleware, errorHandler, rateLimiter } = require('./api/middleware');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use(requestLogger);
app.use(corsMiddleware);
app.use(rateLimiter(15 * 60 * 1000, 1000)); // 1000 requests per 15 minutes

// Routes
app.use('/api', agentRoutes);
app.use('/api', inquiryRoutes);

// Serve landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/project_data.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'project_data.json'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path
    });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║             🍄 Mycelium.org - API Server                   ║
║                                                            ║
║  Server running at: http://localhost:${PORT}                ║
║  Landing page: http://localhost:${PORT}                     ║
║  API Documentation: http://localhost:${PORT}/api            ║
║  Health check: http://localhost:${PORT}/health              ║
║                                                            ║
║  Project data: http://localhost:${PORT}/project_data.json   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
