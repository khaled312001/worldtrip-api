import express from 'express';
import Settings from '../models/Settings.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/settings
// @desc    Get site settings
// @access  Public
router.get('/', async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        // Create default settings if none exist
        if (!settings) {
            settings = await Settings.create({});
        }
        
        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/settings
// @desc    Update site settings
// @access  Private/Admin
router.put('/', protect, admin, async (req, res) => {
    try {
        let settings = await Settings.findOne();
        
        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            settings = await Settings.findByIdAndUpdate(
                settings._id,
                req.body,
                { new: true, runValidators: true }
            );
        }
        
        res.json({ success: true, data: settings, message: 'تم تحديث الإعدادات بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
