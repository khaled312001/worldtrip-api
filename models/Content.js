import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    titleAr: {
        type: String,
        default: ''
    },
    titleEn: {
        type: String,
        default: ''
    },
    contentAr: {
        type: String,
        default: ''
    },
    contentEn: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['hero', 'about', 'services', 'footer', 'seo'],
        default: 'about'
    },
    images: [{
        type: String
    }],
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
