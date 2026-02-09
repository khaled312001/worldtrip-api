import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'World Trip'
    },
    siteNameAr: {
        type: String,
        default: 'وورلد تريب'
    },
    logo: {
        type: String,
        default: '/logo.jpg'
    },
    email: {
        type: String,
        default: 'info@worldtrip.com'
    },
    phone: {
        type: String,
        default: '+966500000000'
    },
    whatsapp: {
        type: String,
        default: '+966500000000'
    },
    address: {
        type: String,
        default: 'الرياض، المملكة العربية السعودية'
    },
    socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' },
        youtube: { type: String, default: '' },
        tiktok: { type: String, default: '' }
    },
    seoMeta: {
        title: { type: String, default: 'World Trip - أفضل وكالة سفر' },
        description: { type: String, default: 'اكتشف العالم معنا - رحلات سياحية مميزة' },
        keywords: { type: String, default: 'سفر، سياحة، رحلات، حجوزات' }
    },
    workingHours: {
        type: String,
        default: 'السبت - الخميس: 9 صباحاً - 9 مساءً'
    },
    currency: {
        type: String,
        default: 'SAR'
    }
}, {
    timestamps: true
});

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
