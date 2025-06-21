const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));

// Import routes (using in-memory version)
const tasksRoutes = require('./routes/tasks-memory');

// Routes
app.use('/api/tasks', tasksRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Task Management API is running (In-Memory Mode)',
        timestamp: new Date().toISOString(),
        database: 'In-Memory Storage (No MySQL required)'
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Task Management API server is running on http://localhost:${PORT}`);
    console.log(`📋 API endpoints available at http://localhost:${PORT}/api/tasks`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
    console.log(`💾 Using IN-MEMORY storage (no database required)`);
    console.log(`✅ Ready for testing!`);
}); 