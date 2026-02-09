import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    console.log('Login request received for:', req.body.email);
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Login failed: Missing email or password');
            return res.status(400).json({
                success: false,
                message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور'
            });
        }

        // Check DB connection state
        if (mongoose.connection.readyState !== 1) {
            console.error('Login failed: Database not connected (State: ' + mongoose.connection.readyState + ')');
            // Attempt to force connection if using our new cached logic might help? 
            // Usually connectDB() is called at start, but let's just log it.
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('Login failed: User not found for email:', email);
            return res.status(401).json({
                success: false,
                message: 'بيانات الدخول غير صحيحة'
            });
        }

        // Check if user model has matchPassword method (it should)
        if (typeof user.matchPassword !== 'function') {
             console.error('CRITICAL: user.matchPassword is not a function on retrieved user object');
             // Fallback comparison if method missing (should not happen if User schema is correct)
             const bcrypt = await import('bcryptjs');
             const isMatch = await bcrypt.compare(password, user.password);
             if (!isMatch) {
                 console.log('Login failed: Password mismatch (fallback check)');
                 return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
             }
        } else {
             const isMatch = await user.matchPassword(password);
             if (!isMatch) {
                console.log('Login failed: Password mismatch');
                return res.status(401).json({
                    success: false,
                    message: 'بيانات الدخول غير صحيحة'
                });
            }
        }

        if (!user.isActive) {
            console.log('Login failed: User inactive');
            return res.status(401).json({
                success: false,
                message: 'الحساب معطل، الرجاء التواصل مع الإدارة'
            });
        }

        const token = generateToken(user._id);
        console.log('Login success for user:', user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('❌ Login Error Trace:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الخادم أثناء تسجيل الدخول',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error',
            details: error.toString() // Temporary for debugging
        });
    }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'غير مخول' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token غير صالح' });
    }
});

export default router;
