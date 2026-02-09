import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Booking from '../models/Booking.js';
import Message from '../models/Message.js';
import Settings from '../models/Settings.js';
import Content from '../models/Content.js';

// Sample Data
const users = [
    {
        name: 'المدير العام',
        email: 'admin@worldtrip.com',
        password: 'admin123',
        role: 'admin',
        phone: '+966500000001'
    },
    {
        name: 'محمد أحمد',
        email: 'manager@worldtrip.com',
        password: 'manager123',
        role: 'manager',
        phone: '+966500000002'
    },
    {
        name: 'سارة علي',
        email: 'staff@worldtrip.com',
        password: 'staff123',
        role: 'staff',
        phone: '+966500000003'
    }
];

const destinations = [
    {
        name: 'AlUla',
        nameAr: 'العلا',
        description: 'Discover the ancient Nabataean tombs and stunning rock formations',
        descriptionAr: 'اكتشف الآثار النبطية والتضاريس الصخرية المذهلة في مدينة العلا التاريخية',
        image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=600',
        rating: 4.9,
        type: 'saudi',
        location: 'المدينة المنورة، السعودية',
        priceFrom: 2500,
        highlights: ['مدائن صالح', 'مرايا للمؤتمرات', 'الفن الصخري', 'جبل الفيل']
    },
    {
        name: 'Jeddah',
        nameAr: 'جدة',
        description: 'The bride of the Red Sea with its rich history and charming beauty',
        descriptionAr: 'عروس البحر الأحمر بتاريخها العريق وجمالها الساحر',
        image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?w=600',
        rating: 4.8,
        type: 'saudi',
        location: 'جدة، السعودية',
        priceFrom: 1800,
        highlights: ['البلد التاريخي', 'كورنيش جدة', 'نافورة الملك فهد', 'أسواق جدة']
    },
    {
        name: 'Dubai',
        nameAr: 'دبي',
        description: 'The city of wonders with its stunning skyscrapers',
        descriptionAr: 'مدينة العجائب بناطحات السحاب المذهلة والترفيه الراقي',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
        rating: 4.9,
        type: 'international',
        location: 'دبي، الإمارات',
        priceFrom: 3500,
        highlights: ['برج خليفة', 'دبي مول', 'نخلة جميرا', 'برواز دبي']
    },
    {
        name: 'Turkey',
        nameAr: 'تركيا',
        description: 'Where East meets West with amazing nature and history',
        descriptionAr: 'حيث يلتقي الشرق بالغرب مع طبيعة خلابة وتاريخ عريق',
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600',
        rating: 4.8,
        type: 'international',
        location: 'إسطنبول، تركيا',
        priceFrom: 4500,
        highlights: ['آيا صوفيا', 'البازار الكبير', 'كبادوكيا', 'أنطاليا']
    },
    {
        name: 'Egypt',
        nameAr: 'مصر',
        description: 'Land of the Pharaohs with ancient wonders',
        descriptionAr: 'أرض الفراعنة وعجائب الدنيا القديمة',
        image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=600',
        rating: 4.7,
        type: 'international',
        location: 'القاهرة، مصر',
        priceFrom: 2800,
        highlights: ['الأهرامات', 'المتحف المصري', 'نهر النيل', 'الأقصر']
    },
    {
        name: 'Malaysia',
        nameAr: 'ماليزيا',
        description: 'Tropical paradise with diverse cultures',
        descriptionAr: 'جنة استوائية بثقافات متنوعة وطبيعة ساحرة',
        image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600',
        rating: 4.6,
        type: 'international',
        location: 'كوالالمبور، ماليزيا',
        priceFrom: 4000,
        highlights: ['أبراج بتروناس', 'لنكاوي', 'جزيرة بينانغ', 'كهوف باتو']
    }
];

const packages = [
    {
        name: 'Honeymoon Package',
        nameAr: 'باقة شهر العسل',
        destination: 'المالديف',
        duration: '7 ليالي',
        durationDays: 7,
        persons: '2 شخص',
        price: 15000,
        originalPrice: 18000,
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600',
        features: ['إقامة في منتجع 5 نجوم', 'إفطار وعشاء يومي', 'جولة بالقارب الخاص', 'سبا وتدليك مجاني', 'تصوير احترافي'],
        type: 'honeymoon',
        popular: true
    },
    {
        name: 'Family Package',
        nameAr: 'الباقة العائلية',
        destination: 'دبي',
        duration: '5 ليالي',
        durationDays: 5,
        persons: '4 أشخاص',
        price: 8500,
        originalPrice: 10000,
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600',
        features: ['فندق 4 نجوم مع إطلالة', 'تذاكر المتنزهات', 'جولة مدينة دبي', 'رحلة صحراوية', 'تأمين سفر شامل'],
        type: 'family',
        popular: true
    },
    {
        name: 'Adventure Package',
        nameAr: 'باقة المغامرات',
        destination: 'تركيا',
        duration: '10 ليالي',
        durationDays: 10,
        persons: '2-6 أشخاص',
        price: 6200,
        originalPrice: 7500,
        image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=600',
        features: ['إسطنبول + كبادوكيا', 'رحلة المنطاد', 'جولات سياحية يومية', 'مرشد سياحي عربي', 'وجبات شاملة'],
        type: 'adventure',
        popular: false
    },
    {
        name: 'Umrah Package',
        nameAr: 'باقة العمرة المميزة',
        destination: 'مكة والمدينة',
        duration: '7 ليالي',
        durationDays: 7,
        persons: '1+ شخص',
        price: 5500,
        originalPrice: 6500,
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600',
        features: ['فندق قريب من الحرم', 'نقل من وإلى المطار', 'زيارة المعالم الدينية', 'مرشد ديني', 'وجبات إفطار'],
        type: 'umrah',
        popular: true
    }
];

const bookings = [
    {
        packageName: 'باقة شهر العسل',
        destination: 'المالديف',
        customerName: 'أحمد محمد الغامدي',
        email: 'ahmed@email.com',
        phone: '+966555000001',
        travelDate: new Date('2026-03-15'),
        travelers: { adults: 2, children: 0 },
        totalPrice: 30000,
        status: 'confirmed',
        paymentStatus: 'paid'
    },
    {
        packageName: 'الباقة العائلية',
        destination: 'دبي',
        customerName: 'محمد عبدالله العتيبي',
        email: 'mohammed@email.com',
        phone: '+966555000002',
        travelDate: new Date('2026-03-20'),
        travelers: { adults: 2, children: 2 },
        totalPrice: 34000,
        status: 'confirmed',
        paymentStatus: 'partial'
    },
    {
        packageName: 'باقة المغامرات',
        destination: 'تركيا',
        customerName: 'خالد سعد القحطاني',
        email: 'khaled@email.com',
        phone: '+966555000003',
        travelDate: new Date('2026-04-01'),
        travelers: { adults: 4, children: 0 },
        totalPrice: 24800,
        status: 'pending',
        paymentStatus: 'unpaid'
    }
];

const messages = [
    {
        name: 'سارة أحمد',
        email: 'sara@email.com',
        phone: '+966555100001',
        subject: 'استفسار عن باقة شهر العسل',
        message: 'السلام عليكم، أريد الاستفسار عن تفاصيل باقة شهر العسل للمالديف وهل يمكن تخصيص البرنامج؟',
        isRead: false
    },
    {
        name: 'عبدالله محمد',
        email: 'abdullah@email.com',
        phone: '+966555100002',
        subject: 'طلب عرض سعر',
        message: 'أريد عرض سعر لرحلة عائلية إلى تركيا لـ 5 أشخاص في شهر يوليو',
        isRead: true,
        isReplied: true
    }
];

const settings = {
    siteName: 'World Trip',
    siteNameAr: 'وورلد تريب',
    logo: '/logo.jpg',
    email: 'info@worldtrip.sa',
    phone: '+966 50 000 0000',
    whatsapp: '+966500000000',
    address: 'الرياض، المملكة العربية السعودية - طريق الملك فهد',
    socialLinks: {
        facebook: 'https://facebook.com/worldtrip',
        twitter: 'https://twitter.com/worldtrip',
        instagram: 'https://instagram.com/worldtrip',
        youtube: 'https://youtube.com/worldtrip',
        tiktok: 'https://tiktok.com/@worldtrip'
    },
    workingHours: 'السبت - الخميس: 9 صباحاً - 9 مساءً',
    currency: 'SAR'
};

const content = [
    {
        key: 'hero',
        titleAr: 'اكتشف العالم معنا',
        titleEn: 'Discover the World with Us',
        contentAr: 'رحلات سياحية مميزة إلى أجمل الوجهات حول العالم',
        contentEn: 'Exceptional travel experiences to the most beautiful destinations worldwide',
        type: 'hero'
    },
    {
        key: 'about',
        titleAr: 'من نحن',
        titleEn: 'About Us',
        contentAr: 'وورلد تريب هي وكالة سفر وسياحة رائدة في المملكة العربية السعودية، نقدم خدمات سياحية متكاملة منذ أكثر من 10 سنوات.',
        contentEn: 'World Trip is a leading travel agency in Saudi Arabia, providing comprehensive tourism services for over 10 years.',
        type: 'about'
    }
];

// Auto-seed function
export const autoSeed = async () => {
    try {
        // Check if data already exists
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('📊 Database already has data, skipping seed...');
            return;
        }

        console.log('🌱 Seeding database with sample data...');
        
        // Seed Users
        await User.create(users);
        console.log('   ✅ Users created');

        // Seed Destinations
        await Destination.create(destinations);
        console.log('   ✅ Destinations created');

        // Seed Packages
        await Package.create(packages);
        console.log('   ✅ Packages created');

        // Seed Bookings
        await Booking.create(bookings);
        console.log('   ✅ Bookings created');

        // Seed Messages
        await Message.create(messages);
        console.log('   ✅ Messages created');

        // Seed Settings
        await Settings.create(settings);
        console.log('   ✅ Settings created');

        // Seed Content
        await Content.create(content);
        console.log('   ✅ Content created');

        console.log(`
╔═══════════════════════════════════════════════╗
║   ✅ Database seeded successfully!            ║
║                                               ║
║   🔐 Admin Login:                             ║
║   Email: admin@worldtrip.com                  ║
║   Password: admin123                          ║
╚═══════════════════════════════════════════════╝
        `);
    } catch (error) {
        console.error('❌ Error auto-seeding database:', error.message);
    }
};

export default autoSeed;
