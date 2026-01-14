# Hızlı Başlangıç Rehberi

Borcelle Fine Dining Restaurant Reservation System'i 5 dakikada çalıştırın.

## Gereksinimler

- Docker ve Docker Compose (önerilen)
- VEYA Python 3.11+, Node.js 18+, PostgreSQL 15+

---

## Seçenek 1: Docker ile Kurulum (En Hızlı)

### Adım 1: Repository'yi Klonlayın

```bash
git clone https://github.com/Nereplaa/restaurant-reservation-system.git
cd restaurant-reservation-system
```

### Adım 2: Tüm Servisleri Başlatın

```bash
docker-compose up --build
```

2-3 dakika bekleyin.

### Adım 3: Uygulamalara Erişin

| Servis | URL |
|--------|-----|
| Müşteri Uygulaması | http://localhost:7002 |
| Admin Paneli | http://localhost:7003 |
| Mutfak Ekranı | http://localhost:7004 |
| API Dokümantasyonu | http://localhost:7001/api/docs |

---

## Seçenek 2: Manuel Kurulum

### Backend Kurulumu

```bash
cd backend

# Virtual environment oluştur
python -m venv venv

# Aktive et (Windows)
venv\Scripts\activate

# Bağımlılıkları yükle
pip install -r requirements.txt

# Ortam değişkenlerini ayarla
cp .env.example .env

# Veritabanını seed'le
python seed.py

# Sunucuyu başlat
python run.py
```

Backend: http://localhost:7001

### Frontend Kurulumu

Her frontend için tekrarlayın: `customer-app`, `admin-panel`, `kitchen-display`

```bash
cd frontend/customer-app
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

## Sistemin Test Edilmesi

### 1. Backend API Testi

```bash
# Sağlık kontrolü
curl http://localhost:7001/health

# Giriş
curl -X POST http://localhost:7001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@restaurant.com","password":"admin123"}'

# Menü listesi
curl http://localhost:7001/api/v1/menu
```

### 2. Müşteri Uygulaması

1. http://localhost:7002 adresini açın
2. Menü öğelerine göz atın
3. Müşteri hesabıyla giriş yapın
4. Test rezervasyonu oluşturun

### 3. Admin Paneli

1. http://localhost:7003 adresini açın
2. Admin bilgileriyle giriş yapın
3. Dashboard istatistiklerini görüntüleyin
4. Siparişleri, rezervasyonları, masaları inceleyin

### 4. Mutfak Ekranı

1. http://localhost:7004 adresini açın
2. Gerçek zamanlı sipariş güncellemelerini görün

---

## Seed Verileri

- **5 Kullanıcı** (farklı roller)
- **26 Masa** (çeşitli kapasiteler)
- **36 Menü Öğesi** (fine dining menü)
- **Örnek Rezervasyon**

---

## Sorun Giderme

### Port Zaten Kullanımda

`docker-compose.yml` veya `.env` dosyalarında portları değiştirin.

### Veritabanı Bağlantı Hatası

```bash
# PostgreSQL çalışıyor mu kontrol edin
docker ps | grep postgres
```

### Frontend Backend'e Bağlanamıyor

Frontend `.env` dosyalarında VITE_API_URL'i kontrol edin:
```env
VITE_API_URL=http://localhost:7001/api/v1
```

### Docker Build Hatası

```bash
docker-compose down -v
docker-compose up --build
```

---

## Sık Kullanılan Komutlar

```bash
# Docker ile başlat
docker-compose up --build

# Docker servislerini durdur
docker-compose down

# Her şeyi sıfırla
docker-compose down -v

# Sadece backend
cd backend && python run.py

# Sadece frontend
cd frontend/customer-app && npm run dev

# Veritabanını seed'le
cd backend && python seed.py
```

---

## Sonraki Adımlar

1. API Dokümantasyonu: http://localhost:7001/api/docs
2. [README.md](README.md) - Ana dokümantasyon
3. [TECHNOLOGIES.md](TECHNOLOGIES.md) - Teknoloji detayları
4. [backend/README.md](backend/README.md) - Backend detayları

---

*Kocaeli Sağlık ve Teknoloji Üniversitesi - 2026*
