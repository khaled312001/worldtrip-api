import express from 'express';
import Content from '../models/Content.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/content
// @desc    Get all content
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};
        if (type) query.type = type;

        const content = await Content.find(query);
        res.json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/content/:key
// @desc    Get content by key
// @access  Public
router.get('/:key', async (req, res) => {
    try {
        const content = await Content.findOne({ key: req.params.key });
        if (!content) {
            return res.status(404).json({ success: false, message: 'المحتوى غير موجود' });
        }
        res.json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/content
// @desc    Create content
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const content = await Content.create(req.body);
        res.status(201).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/content/:key
// @desc    Update content by key
// @access  Private/Admin
router.put('/:key', protect, admin, async (req, res) => {
    try {
        const content = await Content.findOneAndUpdate(
            { key: req.params.key },
            req.body,
            { new: true, upsert: true, runValidators: true }
        );

        res.json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/content/:key
// @desc    Delete content
// @access  Private/Admin
router.delete('/:key', protect, admin, async (req, res) => {
    try {
        const content = await Content.findOneAndDelete({ key: req.params.key });

        if (!content) {
            return res.status(404).json({ success: false, message: 'المحتوى غير موجود' });
        }

        res.json({ success: true, message: 'تم حذف المحتوى بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
