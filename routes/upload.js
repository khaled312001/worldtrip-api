import express from 'express';
import { upload } from '../middleware/upload.js';
import { protect, admin } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// @route   POST /api/upload
// @desc    Upload single image
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'لم يتم تحميل أي ملف' });
        }

        const imageUrl = `/uploads/${req.file.filename}`;
        
        res.json({
            success: true,
            data: {
                filename: req.file.filename,
                url: imageUrl,
                size: req.file.size
            },
            message: 'تم رفع الصورة بنجاح'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/upload/multiple
// @desc    Upload multiple images
// @access  Private/Admin
router.post('/multiple', protect, admin, upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'لم يتم تحميل أي ملفات' });
        }

        const images = req.files.map(file => ({
            filename: file.filename,
            url: `/uploads/${file.filename}`,
            size: file.size
        }));
        
        res.json({
            success: true,
            data: images,
            message: `تم رفع ${images.length} صورة بنجاح`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/upload/:filename
// @desc    Delete uploaded file
// @access  Private/Admin
router.delete('/:filename', protect, admin, async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../uploads', req.params.filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ success: true, message: 'تم حذف الملف بنجاح' });
        } else {
            res.status(404).json({ success: false, message: 'الملف غير موجود' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
