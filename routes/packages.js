import express from 'express';
import Package from '../models/Package.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/packages
// @desc    Get all packages
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { type, popular, active } = req.query;
        let query = {};
        
        if (type) query.type = type;
        if (popular !== undefined) query.popular = popular === 'true';
        if (active !== undefined) query.isActive = active === 'true';

        const packages = await Package.find(query).sort({ popular: -1, createdAt: -1 });
        res.json({ success: true, count: packages.length, data: packages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/packages/:id
// @desc    Get single package
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, message: 'الباقة غير موجودة' });
        }
        res.json({ success: true, data: pkg });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/packages
// @desc    Create package
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const pkg = await Package.create(req.body);
        res.status(201).json({ success: true, data: pkg });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/packages/:id
// @desc    Update package
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const pkg = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!pkg) {
            return res.status(404).json({ success: false, message: 'الباقة غير موجودة' });
        }

        res.json({ success: true, data: pkg });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/packages/:id
// @desc    Delete package
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const pkg = await Package.findByIdAndDelete(req.params.id);

        if (!pkg) {
            return res.status(404).json({ success: false, message: 'الباقة غير موجودة' });
        }

        res.json({ success: true, message: 'تم حذف الباقة بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
