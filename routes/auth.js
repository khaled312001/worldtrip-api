import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور'
            });
        }

        // 1. Find User
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'بيانات الدخول غير صحيحة'
            });
        }

        // 2. Compare Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'بيانات الدخول غير صحيحة'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'الحساب معطل، الرجاء التواصل مع الإدارة'
            });
        }

        // 3. Generate Token with Fallback Secret
        const secret = process.env.JWT_SECRET || 'worldtrip_secret_key_2024';
        const expire = process.env.JWT_EXPIRE || '30d';

        const token = jwt.sign({ id: user._id }, secret, {
            expiresIn: expire
        });
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
        console.error('❌ CRITICAL LOGIN ERROR:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ داخلي في الخادم',
            error: error.message,
            stack: error.stack,
            type: error.name,
            context: 'auth.js:login'
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

        const secret = process.env.JWT_SECRET || 'worldtrip_secret_key_2024';
        const decoded = jwt.verify(token, secret);
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
