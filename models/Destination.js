import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'اسم الوجهة مطلوب'],
        trim: true
    },
    nameAr: {
        type: String,
        required: [true, 'الاسم بالعربية مطلوب'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    descriptionAr: {
        type: String,
        required: [true, 'الوصف بالعربية مطلوب']
    },
    image: {
        type: String,
        required: [true, 'صورة الوجهة مطلوبة']
    },
    galleryImages: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    type: {
        type: String,
        enum: ['saudi', 'international'],
        required: true
    },
    location: {
        type: String,
        default: ''
    },
    highlights: [{
        type: String
    }],
    priceFrom: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);
export default Destination;
