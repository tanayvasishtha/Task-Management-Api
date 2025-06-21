/**
 * Task Management API - SQLite Server
 * A professional REST API for task management with SQLite database
 * Perfect for demos and deployment without external database setup
 * 
 * @author KIIT Student - Keploy Fellowship Session 2
 * @version 1.0.0
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3030;

// ===== MIDDLEWARE CONFIGURATION =====
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('frontend'));

// ===== ROUTES CONFIGURATION =====
// Import SQLite-based task routes
const tasksRoutes = require('./routes/tasks-sqlite');

// API Routes
app.use('/api/tasks', tasksRoutes);

// ===== UTILITY ENDPOINTS =====
// Health check endpoint for monitoring
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Task Management API is running (SQLite)',
        timestamp: new Date().toISOString(),
        database: 'SQLite (Self-contained, deployment ready)',
        version: '1.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage()
    });
});

// Serve modern frontend interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ===== ERROR HANDLING =====
// Handle 404 - Route not found
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('🚨 Error occurred:', err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// ===== SERVER STARTUP =====
app.listen(PORT, () => {
    console.log('\n🎉 Task Management API - SQLite Server Started!');
    console.log('='.repeat(50));
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`📋 API endpoints: http://localhost:${PORT}/api/tasks`);
    console.log(`🌐 Frontend UI: http://localhost:${PORT}`);
    console.log(`❤️  Health check: http://localhost:${PORT}/health`);
    console.log('='.repeat(50));
    console.log(`💾 Database: SQLite (self-contained)`);
    console.log(`🚀 Status: Ready for deployment!`);
    console.log(`📅 Started: ${new Date().toLocaleString()}`);
    console.log('='.repeat(50));
}); 