import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'اسم الباقة مطلوب'],
        trim: true
    },
    nameAr: {
        type: String,
        required: [true, 'الاسم بالعربية مطلوب'],
        trim: true
    },
    destination: {
        type: String,
        required: [true, 'الوجهة مطلوبة']
    },
    destinationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination'
    },
    duration: {
        type: String,
        required: [true, 'المدة مطلوبة']
    },
    durationDays: {
        type: Number,
        default: 5
    },
    persons: {
        type: String,
        required: [true, 'عدد الأشخاص مطلوب']
    },
    price: {
        type: Number,
        required: [true, 'السعر مطلوب']
    },
    originalPrice: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: [true, 'صورة الباقة مطلوبة']
    },
    features: [{
        type: String
    }],
    type: {
        type: String,
        enum: ['honeymoon', 'family', 'adventure', 'umrah', 'business', 'economic'],
        default: 'family'
    },
    popular: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Package = mongoose.model('Package', packageSchema);
export default Package;
