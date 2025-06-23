/**
 * Enhanced Task Management API Server
 * Includes authentication, rate limiting, security headers, and advanced features
 * 
 * @author KIIT Student - Keploy Fellowship Session 2
 * @version 2.0.0
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { initializeDemoUsers } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3040;

// ===== SECURITY MIDDLEWARE =====
// Add security headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        error: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth attempts per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.',
        error: 'AUTH_RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting
app.use(generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ===== BASIC MIDDLEWARE =====
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('frontend'));

// ===== REQUEST LOGGING MIDDLEWARE =====
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const userAgent = req.get('User-Agent') || 'Unknown';
    const ip = req.ip || req.connection.remoteAddress;

    console.log(`📝 ${timestamp} | ${req.method} ${req.url} | IP: ${ip} | UA: ${userAgent.substring(0, 50)}`);
    next();
});

// ===== ROUTES CONFIGURATION =====
// Authentication routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Task routes (SQLite-based)
const tasksRoutes = require('./routes/tasks-sqlite');
app.use('/api/tasks', tasksRoutes);

// ===== ANALYTICS & MONITORING ENDPOINTS =====
app.get('/api/analytics', (req, res) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    res.json({
        success: true,
        message: 'API Analytics',
        data: {
            server: {
                uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
                uptimeSeconds: uptime,
                startTime: new Date(Date.now() - uptime * 1000).toISOString(),
                version: '2.0.0'
            },
            memory: {
                rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
                heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
                heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
                external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
            },
            platform: {
                nodeVersion: process.version,
                platform: process.platform,
                arch: process.arch
            }
        }
    });
});

// ===== DATA EXPORT ENDPOINTS =====
app.get('/api/export/tasks/:format', async (req, res) => {
    try {
        const { format } = req.params;
        const supportedFormats = ['json', 'csv'];

        if (!supportedFormats.includes(format.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: `Unsupported format. Supported formats: ${supportedFormats.join(', ')}`,
                error: 'INVALID_FORMAT'
            });
        }

        // Get tasks (this would typically come from your database)
        // For now, we'll simulate getting tasks
        const tasks = []; // This would be replaced with actual database query

        if (format.toLowerCase() === 'csv') {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="tasks.csv"');

            // Simple CSV generation
            let csv = 'ID,Title,Description,Status,Created At,Updated At\n';
            tasks.forEach(task => {
                csv += `${task.id},"${task.title}","${task.description}",${task.status},${task.created_at},${task.updated_at}\n`;
            });

            res.send(csv);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Content-Disposition', 'attachment; filename="tasks.json"');
            res.json({
                success: true,
                exportDate: new Date().toISOString(),
                format: 'json',
                count: tasks.length,
                data: tasks
            });
        }

    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({
            success: false,
            message: 'Export failed',
            error: 'EXPORT_ERROR'
        });
    }
});

// ===== UTILITY ENDPOINTS =====
// Enhanced health check
app.get('/health', (req, res) => {
    const healthData = {
        status: 'OK',
        message: 'Enhanced Task Management API is running',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        features: [
            'JWT Authentication',
            'Rate Limiting',
            'Security Headers',
            'Request Logging',
            'Data Export',
            'Analytics',
            'SQLite Database'
        ],
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    };

    res.json(healthData);
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
    res.json({
        success: true,
        message: 'Enhanced Task Management API Documentation',
        version: '2.0.0',
        baseUrl: `http://localhost:${PORT}`,
        endpoints: {
            tasks: {
                'GET /api/tasks': 'Get all tasks',
                'GET /api/tasks/:id': 'Get specific task',
                'GET /api/tasks/status/:status': 'Filter tasks by status',
                'POST /api/tasks': 'Create new task',
                'PUT /api/tasks/:id': 'Update task',
                'DELETE /api/tasks/:id': 'Delete task'
            },
            authentication: {
                'POST /api/auth/register': 'Register new user',
                'POST /api/auth/login': 'Login user',
                'GET /api/auth/profile': 'Get user profile (requires auth)',
                'POST /api/auth/verify': 'Verify token (requires auth)',
                'GET /api/auth/demo-credentials': 'Get demo credentials'
            },
            utility: {
                'GET /health': 'Health check',
                'GET /api/analytics': 'Server analytics',
                'GET /api/docs': 'API documentation',
                'GET /api/export/tasks/:format': 'Export tasks (json/csv)'
            }
        },
        authentication: {
            type: 'Bearer Token (JWT)',
            header: 'Authorization: Bearer <token>',
            demoUsers: {
                admin: 'admin123',
                demo: 'demo123'
            }
        },
        rateLimit: {
            general: '100 requests per 15 minutes',
            authentication: '5 attempts per 15 minutes'
        }
    });
});

// Serve enhanced frontend interface
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ===== ERROR HANDLING =====
// Handle 404 - Route not found
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        suggestion: 'Check /api/docs for available endpoints',
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('🚨 Server Error:', err.stack);

    res.status(err.status || 500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        timestamp: new Date().toISOString(),
        requestId: req.get('X-Request-ID') || 'N/A'
    });
});

// ===== SERVER STARTUP =====
async function startServer() {
    try {
        // Initialize demo users for authentication testing
        await initializeDemoUsers();

        app.listen(PORT, () => {
            console.log('\n🚀 Enhanced Task Management API Started!');
            console.log('='.repeat(60));
            console.log(`🌟 Server running on: http://localhost:${PORT}`);
            console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
            console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
            console.log(`🌐 Frontend UI: http://localhost:${PORT}`);
            console.log(`📚 Documentation: http://localhost:${PORT}/api/docs`);
            console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
            console.log(`📊 Analytics: http://localhost:${PORT}/api/analytics`);
            console.log('='.repeat(60));
            console.log(`🔧 Features: JWT Auth, Rate Limiting, Security Headers`);
            console.log(`💾 Database: SQLite (self-contained)`);
            console.log(`🛡️  Security: Helmet, CORS, Rate Limiting`);
            console.log(`📅 Started: ${new Date().toLocaleString()}`);
            console.log(`🎯 Version: 2.0.0 Enhanced`);
            console.log('='.repeat(60));
            console.log(`👤 Demo Users: admin:admin123 | demo:demo123`);
            console.log('='.repeat(60));
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 