import express from 'express';
import Destination from '../models/Destination.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/destinations
// @desc    Get all destinations
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { type, active } = req.query;
        let query = {};
        
        if (type) query.type = type;
        if (active !== undefined) query.isActive = active === 'true';

        const destinations = await Destination.find(query).sort({ createdAt: -1 });
        res.json({ success: true, count: destinations.length, data: destinations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/destinations/:id
// @desc    Get single destination
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ success: false, message: 'الوجهة غير موجودة' });
        }
        res.json({ success: true, data: destination });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/destinations
// @desc    Create destination
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.create(req.body);
        res.status(201).json({ success: true, data: destination });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/destinations/:id
// @desc    Update destination
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!destination) {
            return res.status(404).json({ success: false, message: 'الوجهة غير موجودة' });
        }

        res.json({ success: true, data: destination });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/destinations/:id
// @desc    Delete destination
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);

        if (!destination) {
            return res.status(404).json({ success: false, message: 'الوجهة غير موجودة' });
        }

        res.json({ success: true, message: 'تم حذف الوجهة بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
