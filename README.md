# Cinema Ticket Booking System

ระบบจองตั๋วภาพยนตร์ที่พัฒนาด้วย NestJS (Backend), Angular (Frontend) และ MySQL พร้อมระบบ Containerization ด้วย Docker (Multi-stage build)

## 🚀 Prerequisites (สิ่งที่ต้องเตรียมก่อนรัน)
เพื่อให้ระบบทำงานได้อย่างสมบูรณ์แบบ กรุณาติดตั้งและเปิดใช้งานโปรแกรมต่อไปนี้:
* **Docker Desktop** (ต้องเปิดโปรแกรมให้สถานะเป็น Engine running)
* **Git**

---

## 🛠️ How to run (ขั้นตอนการรันโปรเจกต์)

**1. Clone โปรเจกต์ลงมาที่เครื่องของคุณ**
```bash
git clone https://github.com/Thananop47/movie-ticket-booking.git
cd ชื่อโปรเจกต์
```
2.เปิด Terminal ที่หน้าโฟลเดอร์หลักของโปรเจกต์ แล้วใช้คำสั่ง
```bash
docker-compose up -d --build
```

3.รันคำสั่งด้านล่างนี้เพื่อเพิ่มข้อมูลจำลอง
```bash
docker exec -it cinema_backend node dist/seed/seed-cli.js
```

🌐 การเข้าใช้งานระบบ (Access URLs)
เมื่อทำตามขั้นตอนด้านบนเสร็จสิ้น สามารถเข้าใช้งานระบบได้ที่:

Frontend (หน้าเว็บผู้ใช้และแอดมิน): http://localhost:4200

Backend API: http://localhost:3000/api/v1

🔐 ข้อมูลบัญชีสำหรับทดสอบ (Test Credentials)
ระบบผู้ดูแลระบบ (Admin)

Email: admin@cinema.com

Password: Admin4321!
