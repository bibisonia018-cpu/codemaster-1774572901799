# GhostChat - End-to-End Encrypted Secret Chat 👻🔒

تطبيق دردشة سرية يعتمد على **التشفير من طرف إلى طرف (End-to-End Encryption)**. لا يتم حفظ الرسائل كنصوص واضحة في قاعدة البيانات، بل يتم تشفيرها باستخدام خوارزمية `AES-GCM` في متصفح المستخدم ولا يمكن قراءتها إلا لمن يملك "الرقم السري للغرفة".

## 🚀 التقنيات المستخدمة
- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS
- **Database (Real-time):** Firebase Firestore
- **Security:** Web Crypto API (AES-GCM, PBKDF2)

## ⚙️ طريقة التشغيل محلياً

1. قم بتثبيت الحزم: