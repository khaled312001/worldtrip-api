import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'الاسم مطلوب']
    },
    email: {
        type: String,
        required: [true, 'البريد الإلكتروني مطلوب']
    },
    phone: {
        type: String,
        default: ''
    },
    subject: {
        type: String,
        default: 'استفسار عام'
    },
    message: {
        type: String,
        required: [true, 'نص الرسالة مطلوب']
    },
    isRead: {
        type: Boolean,
        default: false
    },
    isReplied: {
        type: Boolean,
        default: false
    },
    reply: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;
