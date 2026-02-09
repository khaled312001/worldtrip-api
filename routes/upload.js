import express from 'express';
import { upload } from '../middleware/upload.js';
import { protect, admin } from '../middleware/auth.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

const router = express.Router();

// Helper to upload buffer to cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'worldtrip' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        const readable = new Readable();
        readable._read = () => {};
        readable.push(buffer);
        readable.push(null);
        readable.pipe(stream);
    });
};

// @route   POST /api/upload
// @desc    Upload single image
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'لم يتم تحميل أي ملف' });
        }

        const result = await uploadToCloudinary(req.file.buffer);
        
        res.json({
            success: true,
            data: {
                filename: result.public_id,
                url: result.secure_url,
                size: result.bytes
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

        const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
        const results = await Promise.all(uploadPromises);

        const images = results.map(result => ({
            filename: result.public_id,
            url: result.secure_url,
            size: result.bytes
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
