import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    bookingNumber: {
        type: String,
        unique: true
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package'
    },
    packageName: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: [true, 'اسم العميل مطلوب']
    },
    email: {
        type: String,
        required: [true, 'البريد الإلكتروني مطلوب']
    },
    phone: {
        type: String,
        required: [true, 'رقم الهاتف مطلوب']
    },
    travelDate: {
        type: Date,
        required: [true, 'تاريخ السفر مطلوب']
    },
    returnDate: {
        type: Date
    },
    travelers: {
        adults: { type: Number, default: 1 },
        children: { type: Number, default: 0 }
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'partial', 'paid'],
        default: 'unpaid'
    },
    notes: {
        type: String,
        default: ''
    },
    specialRequests: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Generate booking number before saving
bookingSchema.pre('save', async function(next) {
    if (!this.bookingNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.bookingNumber = `WT${year}${month}${random}`;
    }
    next();
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
