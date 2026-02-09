import express from 'express';
import Message from '../models/Message.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/messages
// @desc    Get all messages
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const { isRead } = req.query;
        let query = {};
        if (isRead !== undefined) query.isRead = isRead === 'true';

        const messages = await Message.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/messages/unread-count
// @desc    Get unread messages count
// @access  Private/Admin
router.get('/unread-count', protect, admin, async (req, res) => {
    try {
        const count = await Message.countDocuments({ isRead: false });
        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/messages/:id
// @desc    Get single message
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).json({ success: false, message: 'الرسالة غير موجودة' });
        }
        res.json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/messages
// @desc    Create message (Contact form)
// @access  Public
router.post('/', async (req, res) => {
    try {
        const message = await Message.create(req.body);
        res.status(201).json({ 
            success: true, 
            data: message,
            message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PATCH /api/messages/:id/read
// @desc    Mark message as read
// @access  Private/Admin
router.patch('/:id/read', protect, admin, async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({ success: false, message: 'الرسالة غير موجودة' });
        }

        res.json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (!message) {
            return res.status(404).json({ success: false, message: 'الرسالة غير موجودة' });
        }

        res.json({ success: true, message: 'تم حذف الرسالة بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
