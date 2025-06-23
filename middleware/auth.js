/**
 * Authentication Middleware
 * Provides JWT-based authentication for the Task Management API
 * 
 * @author KIIT Student - Keploy Fellowship Session 2
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Secret key for JWT (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'keploy-fellowship-secret-key-2024';
const SALT_ROUNDS = 10;

// In-memory user store (in production, use a database)
const users = new Map();

/**
 * Hash a password using bcrypt
 */
async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against its hash
 */
async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token for a user
 */
function generateToken(userId, username) {
    return jwt.sign(
        {
            userId,
            username,
            iat: Math.floor(Date.now() / 1000)
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Register a new user
 */
async function registerUser(username, password, email) {
    if (users.has(username)) {
        throw new Error('Username already exists');
    }

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
    }

    const hashedPassword = await hashPassword(password);
    const userId = Date.now().toString();

    const user = {
        id: userId,
        username,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        isActive: true
    };

    users.set(username, user);

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
    };
}

/**
 * Authenticate user login
 */
async function loginUser(username, password) {
    const user = users.get(username);

    if (!user || !user.isActive) {
        throw new Error('Invalid username or password');
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
        throw new Error('Invalid username or password');
    }

    const token = generateToken(user.id, user.username);

    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        },
        token,
        expiresIn: '24h'
    };
}

/**
 * Middleware to authenticate requests
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required',
            error: 'MISSING_TOKEN'
        });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token',
            error: 'INVALID_TOKEN'
        });
    }

    // Add user info to request
    req.user = decoded;
    next();
}

/**
 * Optional authentication - for endpoints that work with or without auth
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
        }
    }

    next();
}

/**
 * Get user profile by username
 */
function getUserProfile(username) {
    const user = users.get(username);
    if (!user) return null;

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        isActive: user.isActive
    };
}

/**
 * Initialize with demo users
 */
async function initializeDemoUsers() {
    try {
        // Create demo admin user
        await registerUser('admin', 'admin123', 'admin@taskapi.com');

        // Create demo regular user
        await registerUser('demo', 'demo123', 'demo@taskapi.com');

        console.log('✅ Demo users initialized');
        console.log('   👤 admin:admin123 | demo:demo123');
    } catch (error) {
        // Users might already exist
        console.log('ℹ️  Demo users already exist or initialization skipped');
    }
}

module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken,
    registerUser,
    loginUser,
    authenticateToken,
    optionalAuth,
    getUserProfile,
    initializeDemoUsers
}; 