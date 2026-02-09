import express from 'express';
import Booking from '../models/Booking.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const { status, from, to } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const bookings = await Booking.find(query)
            .populate('package', 'name nameAr image')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private/Admin
router.get('/:id', protect, admin, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('package');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'الحجز غير موجود' });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/bookings
// @desc    Create booking (Public - from website)
// @access  Public
router.post('/', async (req, res) => {
    try {
        const booking = await Booking.create(req.body);
        
        res.status(201).json({ 
            success: true, 
            data: booking,
            message: 'تم استلام حجزك بنجاح! سيتم التواصل معك قريباً'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: 'الحجز غير موجود' });
        }

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PATCH /api/bookings/:id/status
// @desc    Update booking status
// @access  Private/Admin
router.patch('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: 'الحجز غير موجود' });
        }

        res.json({ success: true, data: booking, message: 'تم تحديث حالة الحجز' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/bookings/:id
// @desc    Delete booking
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'الحجز غير موجود' });
        }

        res.json({ success: true, message: 'تم حذف الحجز بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
