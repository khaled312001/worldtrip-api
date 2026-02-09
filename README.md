# World Trip API - Backend

## نشر الـ Backend على Render (مجاني)

### الخطوات:

1. **إنشاء حساب MongoDB Atlas (مجاني):**
   - اذهب إلى https://www.mongodb.com/cloud/atlas
   - أنشئ حساب مجاني
   - أنشئ Cluster جديد (اختر Free tier)
   - أنشئ Database User
   - احصل على Connection String

2. **نشر على Render:**
   - اذهب إلى https://render.com
   - اربط حسابك بـ GitHub
   - أنشئ "New Web Service"
   - اختر هذا الـ Repository
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

3. **أضف Environment Variables في Render:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/worldtrip
   JWT_SECRET=your_super_secret_key_here_change_this
   JWT_EXPIRE=30d
   NODE_ENV=production
   FRONTEND_URL=https://travelbarmagly.vercel.app
   ```

4. **بعد النشر، احصل على URL الخاص بالـ Backend (مثال: https://worldtrip-api.onrender.com)**

5. **أضف Environment Variable في Vercel:**
   - اذهب إلى إعدادات مشروعك في Vercel
   - Settings → Environment Variables
   - أضف:
     ```
     VITE_API_URL=https://worldtrip-api.onrender.com/api
     ```
   - أعد نشر الموقع

---

## للتطوير المحلي:

```bash
cd server
npm install
npm start
```

البيانات الافتراضية:
- Admin: admin@worldtrip.com / admin123
