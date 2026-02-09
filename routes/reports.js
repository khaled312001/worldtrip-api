import express from 'express';
import Booking from '../models/Booking.js';
import Package from '../models/Package.js';
import Destination from '../models/Destination.js';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reports/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
        const totalPackages = await Package.countDocuments({ isActive: true });
        const totalDestinations = await Destination.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments();
        const unreadMessages = await Message.countDocuments({ isRead: false });

        // Calculate revenue
        const bookings = await Booking.find({ status: { $in: ['confirmed', 'completed'] } });
        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

        // Monthly revenue (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const monthlyData = await Booking.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    status: { $in: ['confirmed', 'completed'] }
                }
            },
            {
                $group: {
                    _id: { 
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    revenue: { $sum: '$totalPrice' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Recent bookings
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('bookingNumber customerName packageName totalPrice status createdAt');

        res.json({
            success: true,
            data: {
                overview: {
                    totalBookings,
                    pendingBookings,
                    confirmedBookings,
                    totalPackages,
                    totalDestinations,
                    totalUsers,
                    unreadMessages,
                    totalRevenue
                },
                monthlyData,
                recentBookings
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/reports/bookings
// @desc    Get bookings report
// @access  Private/Admin
router.get('/bookings', protect, admin, async (req, res) => {
    try {
        const { from, to } = req.query;
        let dateQuery = {};
        
        if (from) dateQuery.$gte = new Date(from);
        if (to) dateQuery.$lte = new Date(to);

        const query = Object.keys(dateQuery).length > 0 ? { createdAt: dateQuery } : {};

        const bookings = await Booking.find(query).sort({ createdAt: -1 });
        
        const summary = {
            total: bookings.length,
            pending: bookings.filter(b => b.status === 'pending').length,
            confirmed: bookings.filter(b => b.status === 'confirmed').length,
            cancelled: bookings.filter(b => b.status === 'cancelled').length,
            completed: bookings.filter(b => b.status === 'completed').length,
            revenue: bookings
                .filter(b => ['confirmed', 'completed'].includes(b.status))
                .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
        };

        res.json({ success: true, data: { bookings, summary } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/reports/popular-destinations
// @desc    Get popular destinations
// @access  Private/Admin
router.get('/popular-destinations', protect, admin, async (req, res) => {
    try {
        const popularDestinations = await Booking.aggregate([
            {
                $group: {
                    _id: '$destination',
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json({ success: true, data: popularDestinations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
