import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load models
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Package from '../models/Package.js';
import Booking from '../models/Booking.js';
import Message from '../models/Message.js';
import Settings from '../models/Settings.js';
import Content from '../models/Content.js';

dotenv.config();

// Sample Data

const users = [
    {
        name: 'المدير العام',
        email: 'admin@worldtrip.com',
        password: bcrypt.hashSync('admin123', 10), // Hash manually
        role: 'admin',
        phone: '+966500000001'
    },
    {
        name: 'محمد أحمد',
        email: 'manager@worldtrip.com',
        password: bcrypt.hashSync('manager123', 10), // Hash manually
        role: 'manager',
        phone: '+966500000002'
    },
    {
        name: 'سارة علي',
        email: 'staff@worldtrip.com',
        password: bcrypt.hashSync('staff123', 10), // Hash manually
        role: 'staff',
        phone: '+966500000003'
    }
];

const destinations = [
    // Saudi Destinations
    {
        name: 'AlUla',
        nameAr: 'العلا',
        description: 'Discover the ancient Nabataean tombs and stunning rock formations',
        descriptionAr: 'اكتشف الآثار النبطية والتضاريس الصخرية المذهلة في مدينة العلا التاريخية',
        image: '/assets/dest-alula.jpg',
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
        image: '/assets/dest-jeddah.jpg',
        rating: 4.8,
        type: 'saudi',
        location: 'جدة، السعودية',
        priceFrom: 1800,
        highlights: ['البلد التاريخي', 'كورنيش جدة', 'نافورة الملك فهد', 'أسواق جدة']
    },
    {
        name: 'Riyadh',
        nameAr: 'الرياض',
        description: 'The vibrant capital with its modern landmarks',
        descriptionAr: 'العاصمة النابضة بالحياة ومعالمها الحديثة',
        image: '/assets/dest-riyadh.jpg',
        rating: 4.7,
        type: 'saudi',
        location: 'الرياض، السعودية',
        priceFrom: 1500,
        highlights: ['برج المملكة', 'حي الدرعية', 'متحف الرياض', 'بوليفارد']
    },
    {
        name: 'NEOM',
        nameAr: 'نيوم',
        description: 'The city of the future and the latest mega projects',
        descriptionAr: 'مدينة المستقبل وأحدث المشاريع السياحية الضخمة',
        image: '/assets/dest-neom.jpg',
        rating: 4.9,
        type: 'saudi',
        location: 'تبوك، السعودية',
        priceFrom: 5000,
        highlights: ['ذا لاين', 'تروجينا', 'أوكساجون', 'سندالة']
    },
    // International Destinations
    {
        name: 'Dubai',
        nameAr: 'دبي',
        description: 'The city of wonders with its stunning skyscrapers',
        descriptionAr: 'مدينة العجائب بناطحات السحاب المذهلة والترفيه الراقي',
        image: '/assets/dest-dubai.jpg',
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
        image: '/assets/dest-turkey.jpg',
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
        image: '/assets/dest-egypt.jpg',
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
        image: '/assets/dest-malaysia.jpg',
        rating: 4.6,
        type: 'international',
        location: 'كوالالمبور، ماليزيا',
        priceFrom: 4000,
        highlights: ['أبراج بتروناس', 'لنكاوي', 'جزيرة بينانغ', 'كهوف باتو']
    },
    {
        name: 'Georgia',
        nameAr: 'جورجيا',
        description: 'Hidden gem with breathtaking mountains',
        descriptionAr: 'جوهرة مخفية بجبال خلابة وطبيعة بكر',
        image: '/assets/dest-georgia.jpg',
        rating: 4.7,
        type: 'international',
        location: 'تبليسي، جورجيا',
        priceFrom: 3200,
        highlights: ['تبليسي القديمة', 'كازبيجي', 'باتومي', 'جبال القوقاز']
    },
    {
        name: 'Europe',
        nameAr: 'أوروبا',
        description: 'Classic charm of European capitals',
        descriptionAr: 'سحر العواصم الأوروبية الكلاسيكي',
        image: '/assets/dest-europe.jpg',
        rating: 4.9,
        type: 'international',
        location: 'عدة دول',
        priceFrom: 8000,
        highlights: ['باريس', 'لندن', 'روما', 'برشلونة']
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
    },
    {
        name: 'Europe Tour',
        nameAr: 'جولة أوروبا الساحرة',
        destination: 'فرنسا - إيطاليا - سويسرا',
        duration: '12 ليلة',
        durationDays: 12,
        persons: '2 شخص',
        price: 18000,
        originalPrice: 22000,
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
        features: ['3 دول في رحلة واحدة', 'فنادق 4 نجوم', 'جولات يومية', 'تذاكر الطيران الداخلي', 'تأشيرة شنغن'],
        type: 'adventure',
        popular: false
    },
    {
        name: 'Georgia Economic',
        nameAr: 'باقة جورجيا الاقتصادية',
        destination: 'جورجيا',
        duration: '6 ليالي',
        durationDays: 6,
        persons: '2-4 أشخاص',
        price: 4200,
        originalPrice: 5000,
        image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=600',
        features: ['تبليسي + باتومي', 'فنادق 3 نجوم', 'جولات سياحية', 'إفطار يومي', 'نقل خاص'],
        type: 'economic',
        popular: false
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
    },
    {
        packageName: 'باقة العمرة المميزة',
        destination: 'مكة والمدينة',
        customerName: 'عبدالرحمن فهد السبيعي',
        email: 'abdulrahman@email.com',
        phone: '+966555000004',
        travelDate: new Date('2026-03-10'),
        travelers: { adults: 3, children: 1 },
        totalPrice: 22000,
        status: 'confirmed',
        paymentStatus: 'paid'
    },
    {
        packageName: 'جولة أوروبا الساحرة',
        destination: 'فرنسا - إيطاليا - سويسرا',
        customerName: 'سلمان حسن الدوسري',
        email: 'salman@email.com',
        phone: '+966555000005',
        travelDate: new Date('2026-05-20'),
        travelers: { adults: 2, children: 0 },
        totalPrice: 36000,
        status: 'pending',
        paymentStatus: 'unpaid'
    },
    {
        packageName: 'باقة جورجيا الاقتصادية',
        destination: 'جورجيا',
        customerName: 'ناصر علي الحربي',
        email: 'nasser@email.com',
        phone: '+966555000006',
        travelDate: new Date('2026-04-10'),
        travelers: { adults: 2, children: 2 },
        totalPrice: 16800,
        status: 'confirmed',
        paymentStatus: 'paid'
    },
    {
        packageName: 'الباقة العائلية',
        destination: 'دبي',
        customerName: 'فهد محمد الشمري',
        email: 'fahad@email.com',
        phone: '+966555000007',
        travelDate: new Date('2026-03-25'),
        travelers: { adults: 2, children: 3 },
        totalPrice: 42500,
        status: 'cancelled',
        paymentStatus: 'unpaid'
    },
    {
        packageName: 'باقة شهر العسل',
        destination: 'المالديف',
        customerName: 'عمر سعيد العنزي',
        email: 'omar@email.com',
        phone: '+966555000008',
        travelDate: new Date('2026-04-20'),
        travelers: { adults: 2, children: 0 },
        totalPrice: 30000,
        status: 'pending',
        paymentStatus: 'unpaid'
    },
    {
        packageName: 'باقة المغامرات',
        destination: 'تركيا',
        customerName: 'يوسف أحمد المطيري',
        email: 'yousef@email.com',
        phone: '+966555000009',
        travelDate: new Date('2026-05-05'),
        travelers: { adults: 6, children: 0 },
        totalPrice: 37200,
        status: 'confirmed',
        paymentStatus: 'paid'
    },
    {
        packageName: 'باقة العمرة المميزة',
        destination: 'مكة والمدينة',
        customerName: 'تركي عبدالله الزهراني',
        email: 'turki@email.com',
        phone: '+966555000010',
        travelDate: new Date('2026-03-05'),
        travelers: { adults: 2, children: 0 },
        totalPrice: 11000,
        status: 'completed',
        paymentStatus: 'paid'
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
    },
    {
        name: 'نورة سالم',
        email: 'noura@email.com',
        phone: '+966555100003',
        subject: 'استفسار عن تأشيرة',
        message: 'هل تساعدون في استخراج تأشيرة شنغن لرحلة أوروبا؟',
        isRead: false
    },
    {
        name: 'فيصل العتيبي',
        email: 'faisal@email.com',
        phone: '+966555100004',
        subject: 'تعديل حجز',
        message: 'أريد تعديل موعد رحلتي إلى دبي من 20 مارس إلى 25 مارس',
        isRead: true
    },
    {
        name: 'منى الحربي',
        email: 'mona@email.com',
        phone: '+966555100005',
        subject: 'شكر وتقدير',
        message: 'شكراً جزيلاً على الخدمة الممتازة في رحلتنا الأخيرة لتركيا. كانت تجربة رائعة!',
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
    seoMeta: {
        title: 'World Trip - وورلد تريب | أفضل وكالة سفر وسياحة',
        description: 'اكتشف العالم معنا! وورلد تريب تقدم أفضل الباقات السياحية والرحلات المميزة بأسعار تنافسية',
        keywords: 'سفر، سياحة، رحلات، حجوزات، باقات سياحية، شهر عسل، عائلية، عمرة'
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
    },
    {
        key: 'services',
        titleAr: 'خدماتنا',
        titleEn: 'Our Services',
        contentAr: 'نقدم مجموعة متنوعة من الخدمات السياحية تشمل حجز الفنادق، تذاكر الطيران، الباقات السياحية، وخدمات التأشيرات.',
        contentEn: 'We offer a variety of tourism services including hotel bookings, flight tickets, travel packages, and visa services.',
        type: 'services'
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️ Clearing existing data...');
        await User.deleteMany({});
        await Destination.deleteMany({});
        await Package.deleteMany({});
        await Booking.deleteMany({});
        await Message.deleteMany({});
        await Settings.deleteMany({});
        await Content.deleteMany({});

        // Seed Users
        console.log('👤 Seeding users...');
        await User.insertMany(users);

        // Seed Destinations
        console.log('🗺️ Seeding destinations...');
        await Destination.create(destinations);

        // Seed Packages
        console.log('📦 Seeding packages...');
        await Package.create(packages);

        // Seed Bookings
        console.log('📅 Seeding bookings...');
        await Booking.create(bookings);

        // Seed Messages
        console.log('💬 Seeding messages...');
        await Message.create(messages);

        // Seed Settings
        console.log('⚙️ Seeding settings...');
        await Settings.create(settings);

        // Seed Content
        console.log('📝 Seeding content...');
        await Content.create(content);

        console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   ✅ Database seeded successfully!            ║
║                                               ║
║   📊 Data Summary:                            ║
║   • Users: ${users.length}                                   ║
║   • Destinations: ${destinations.length}                            ║
║   • Packages: ${packages.length}                                ║
║   • Bookings: ${bookings.length}                               ║
║   • Messages: ${messages.length}                                ║
║                                               ║
║   🔐 Admin Login:                             ║
║   Email: admin@worldtrip.com                  ║
║   Password: admin123                          ║
║                                               ║
╚═══════════════════════════════════════════════╝
        `);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
