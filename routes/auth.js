/**
 * Authentication Routes
 * Handles user registration, login, and profile management
 * 
 * @author KIIT Student - Keploy Fellowship Session 2
 */

const express = require('express');
const {
    registerUser,
    loginUser,
    authenticateToken,
    getUserProfile
} = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Validation
        if (!username || !password || !email) {
            return res.status(400).json({
                success: false,
                message: 'Username, password, and email are required',
                error: 'MISSING_FIELDS'
            });
        }

        if (username.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Username must be at least 3 characters long',
                error: 'INVALID_USERNAME'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address',
                error: 'INVALID_EMAIL'
            });
        }

        const user = await registerUser(username, password, email);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: user
        });

    } catch (error) {
        console.error('Registration error:', error.message);

        if (error.message === 'Username already exists') {
            return res.status(409).json({
                success: false,
                message: error.message,
                error: 'USERNAME_EXISTS'
            });
        }

        if (error.message.includes('Password must be')) {
            return res.status(400).json({
                success: false,
                message: error.message,
                error: 'INVALID_PASSWORD'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: 'REGISTRATION_ERROR'
        });
    }
});

/**
 * POST /api/auth/login
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required',
                error: 'MISSING_CREDENTIALS'
            });
        }

        const authData = await loginUser(username, password);

        res.json({
            success: true,
            message: 'Login successful',
            data: authData
        });

    } catch (error) {
        console.error('Login error:', error.message);

        res.status(401).json({
            success: false,
            message: error.message,
            error: 'AUTHENTICATION_FAILED'
        });
    }
});

/**
 * GET /api/auth/profile
 * Get current user profile (requires authentication)
 */
router.get('/profile', authenticateToken, (req, res) => {
    try {
        const profile = getUserProfile(req.user.username);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found',
                error: 'PROFILE_NOT_FOUND'
            });
        }

        res.json({
            success: true,
            message: 'Profile retrieved successfully',
            data: profile
        });

    } catch (error) {
        console.error('Profile error:', error.message);

        res.status(500).json({
            success: false,
            message: 'Failed to retrieve profile',
            error: 'PROFILE_ERROR'
        });
    }
});

/**
 * POST /api/auth/verify
 * Verify if a token is valid
 */
router.post('/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token is valid',
        data: {
            userId: req.user.userId,
            username: req.user.username,
            iat: req.user.iat,
            exp: req.user.exp
        }
    });
});

/**
 * GET /api/auth/demo-credentials
 * Get demo user credentials for testing
 */
router.get('/demo-credentials', (req, res) => {
    res.json({
        success: true,
        message: 'Demo credentials for testing',
        data: {
            users: [
                {
                    username: 'admin',
                    password: 'admin123',
                    email: 'admin@taskapi.com',
                    role: 'Administrator'
                },
                {
                    username: 'demo',
                    password: 'demo123',
                    email: 'demo@taskapi.com',
                    role: 'User'
                }
            ],
            note: 'Use these credentials to test the authentication system',
            endpoints: {
                login: 'POST /api/auth/login',
                register: 'POST /api/auth/register',
                profile: 'GET /api/auth/profile',
                verify: 'POST /api/auth/verify'
            }
        }
    });
});

module.exports = router; 