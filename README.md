# Borcelle Fine Dining - Restaurant Reservation System

Yapay Zeka Destekli Restoran Rezervasyon Sistemi

**Kocaeli Sağlık ve Teknoloji Üniversitesi**  
Mühendislik ve Doğa Bilimleri Fakültesi  
Bilgisayar/Yazılım Mühendisliği

## Proje Ekibi

| İsim | Öğrenci No | Görev |
|------|------------|-------|
| Simanur Gürsoy | 230502027 | Raporlama, Dokümantasyon, Frontend |
| Ebrar İkbal Karakuzu | 230502028 | Sunum, Görselleştirme, Frontend |
| Alperen Yağmur | 250502015 | Backend, Frontend, Sistem Mimarisi |
| Utku Daşar | 240502061 | Proje Takibi |

**Ders Sorumlusu:** Dr. Öğr. Üyesi Elif Pınar Hacıbeyoğlu

---

## Proje Hakkında

Bu proje, restoran rezervasyon süreçlerinde yaşanan manuel yönetim sorunlarına çözüm sunmak amacıyla geliştirilmiş yapay zeka destekli bir web uygulamasıdır.

### Temel Özellikler

- **Müşteri Portalı**: Menü görüntüleme, rezervasyon oluşturma, AI chatbot desteği
- **Admin Paneli**: Masa, menü, rezervasyon ve kullanıcı yönetimi
- **Mutfak Ekranı**: Gerçek zamanlı sipariş takibi
- **AI Chatbot**: Müşteri sorularını yanıtlayan yapay zeka asistanı
- **Çoklu Rol Desteği**: Müşteri, Servis, Mutfak, Yönetici, Admin

---

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| Backend | Python 3.11+, FastAPI, SQLAlchemy |
| Frontend | React 18, TypeScript, Vite |
| Veritabanı | PostgreSQL 15 |
| Gerçek Zamanlı | Socket.IO (WebSocket) |
| AI/LLM | LM Studio (Local LLM) |
| Containerization | Docker, Docker Compose |
| Kimlik Doğrulama | JWT, Bcrypt |

---

## Hızlı Başlangıç

### Docker ile Çalıştırma (Önerilen)

```bash
docker-compose up --build
```

### Erişim Adresleri

| Servis | Port | URL |
|--------|------|-----|
| Müşteri Uygulaması | 7002 | http://localhost:7002 |
| Admin Paneli | 7003 | http://localhost:7003 |
| Mutfak Ekranı | 7004 | http://localhost:7004 |
| API Dokümantasyonu | 7001 | http://localhost:7001/api/docs |
| PostgreSQL | 7005 | - |

### Manuel Kurulum

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python seed.py
python run.py
```

**Frontend:**
```bash
cd frontend/customer-app  # veya admin-panel, kitchen-display
npm install
npm run dev
```

---

## Test Hesapları

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Admin | admin@restaurant.com | admin123 |
| Yönetici | manager@restaurant.com | manager123 |
| Servis | server@restaurant.com | server123 |
| Mutfak | kitchen@restaurant.com | kitchen123 |
| Müşteri | customer@example.com | customer123 |

---

## Proje Yapısı

```
restaurant-reservation-system/
├── backend/                 # Python FastAPI Backend
│   ├── app/
│   │   ├── models/         # Veritabanı modelleri
│   │   ├── routers/        # API endpoint'leri
│   │   ├── schemas/        # Pydantic şemaları
│   │   └── utils/          # Yardımcı fonksiyonlar
│   ├── alembic/            # Veritabanı migration'ları
│   └── requirements.txt
├── frontend/
│   ├── customer-app/       # Müşteri uygulaması
│   └── admin-panel/        # Yönetici paneli
├── kitchen-display/        # Mutfak ekranı
├── docker-compose.yml
└── README.md
```

---

## API Endpoint'leri

### Kimlik Doğrulama
- `POST /api/v1/auth/register` - Kullanıcı kaydı
- `POST /api/v1/auth/login` - Giriş
- `GET /api/v1/auth/me` - Mevcut kullanıcı

### Rezervasyonlar
- `GET /api/v1/reservations` - Rezervasyon listesi
- `POST /api/v1/reservations` - Yeni rezervasyon
- `PATCH /api/v1/reservations/:id` - Güncelleme
- `DELETE /api/v1/reservations/:id` - Silme

### Menü
- `GET /api/v1/menu` - Menü listesi
- `POST /api/v1/menu` - Yeni öğe (admin)
- `PATCH /api/v1/menu/:id` - Güncelleme
- `DELETE /api/v1/menu/:id` - Silme

### Masalar
- `GET /api/v1/tables` - Masa listesi
- `POST /api/v1/tables` - Yeni masa
- `PATCH /api/v1/tables/:id` - Güncelleme

### Siparişler
- `GET /api/v1/orders` - Sipariş listesi
- `POST /api/v1/orders` - Yeni sipariş
- `PATCH /api/v1/orders/:id/status` - Durum güncelleme

---

## Veritabanı Şeması

- **users** - Kullanıcı hesapları ve rolleri
- **tables** - Restoran masaları
- **reservations** - Rezervasyon kayıtları
- **menu_items** - Menü öğeleri
- **orders** - Sipariş kayıtları
- **order_items** - Sipariş detayları

---

## Kullanıcı Rolleri

| Rol | Yetkiler |
|-----|----------|
| Müşteri | Rezervasyon oluşturma, menü görüntüleme, chatbot kullanımı |
| Servis | Sipariş oluşturma, masa durumu yönetimi |
| Mutfak | Sipariş görüntüleme, hazırlık durumu güncelleme |
| Yönetici | Menü, masa ve rezervasyon yönetimi |
| Admin | Tam sistem erişimi, kullanıcı yönetimi |

---

## Güvenlik

- JWT tabanlı kimlik doğrulama
- Bcrypt ile şifre hashleme
- Rol tabanlı erişim kontrolü
- CORS yapılandırması
- Rate limiting
- SQL injection koruması (ORM)

---

## Dokümantasyon

- [Hızlı Başlangıç Rehberi](QUICK-START.md)
- [Teknoloji Detayları](TECHNOLOGIES.md)
- [Backend README](backend/README.md)
- [Katkı Rehberi](CONTRIBUTING.md)

---

## Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

---

*Kocaeli Sağlık ve Teknoloji Üniversitesi - 2026*
