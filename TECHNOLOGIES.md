# Borcelle Fine Dining - Teknoloji Dokümantasyonu

Bu dokümanda **Borcelle Fine Dining Restaurant Reservation System** projesinde kullanılan tüm teknolojiler, kütüphaneler ve araçlar detaylı şekilde açıklanmaktadır.

---

## 🎯 Genel Bakış

| Katman | Teknoloji |
|--------|-----------|
| Backend | Python + FastAPI |
| Frontend | React + TypeScript |
| Veritabanı | PostgreSQL |
| Gerçek Zamanlı İletişim | WebSocket (Socket.IO) |
| Containerization | Docker |
| AI Entegrasyonu | LM Studio (Local LLM) |

---

## 🐍 Backend Teknolojileri

### FastAPI
Modern, hızlı ve yüksek performanslı bir Python web framework'üdür. Otomatik API dokümantasyonu (Swagger/OpenAPI), tip güvenliği ve async/await desteği sunar. RESTful API'ler oluşturmak için ideal bir seçimdir.

**Projede Kullanımı:** Tüm backend API endpoint'lerini oluşturmak için kullanıyoruz. Rezervasyon, menü, kullanıcı, sipariş ve masa yönetimi API'leri FastAPI ile geliştirildi. `/docs` endpoint'inde otomatik Swagger dokümantasyonu sunuyor.

---

### Uvicorn
ASGI (Asynchronous Server Gateway Interface) protokolünü destekleyen Python için yüksek performanslı bir web sunucusudur. FastAPI uygulamalarını çalıştırmak için kullanılır ve async işlemleri verimli şekilde yönetir.

**Projede Kullanımı:** Backend sunucusunu ayağa kaldırmak için kullanıyoruz. `run.py` dosyasında Uvicorn ile uygulama 7001 portunda çalıştırılıyor.

---

### SQLAlchemy
Python için en popüler ORM (Object-Relational Mapping) kütüphanesidir. Veritabanı tablolarını Python sınıfları olarak tanımlamamızı ve SQL sorguları yerine Python kodu ile veritabanı işlemleri yapmamızı sağlar.

**Projede Kullanımı:** User, Table, MenuItem, Reservation, Order gibi tüm veritabanı modellerini tanımlamak için kullanıyoruz. `app/models/` klasöründeki tüm modeller SQLAlchemy ile yazıldı.

---

### Alembic
SQLAlchemy için veritabanı migration (göç) aracıdır. Veritabanı şema değişikliklerini takip eder ve versiyonlar arası geçişleri yönetir.

**Projede Kullanımı:** Veritabanı şemasında değişiklik yapıldığında migration dosyaları oluşturmak ve uygulamak için kullanıyoruz. Yeni tablo veya kolon eklediğimizde Alembic ile güvenli şekilde güncelleme yapıyoruz.

---

### Psycopg2
PostgreSQL veritabanı için Python adaptörüdür. SQLAlchemy'nin PostgreSQL ile iletişim kurmasını sağlayan düşük seviyeli sürücüdür.

**Projede Kullanımı:** SQLAlchemy'nin PostgreSQL veritabanına bağlanması için arka planda çalışır. Connection string'de `postgresql://` kullanarak veritabanı bağlantısı kuruyoruz.

---

### Pydantic
Veri doğrulama ve ayar yönetimi için kullanılan kütüphanedir. API request/response modellerini tanımlar, otomatik tip dönüşümü ve validation sağlar.

**Projede Kullanımı:** API request ve response şemalarını tanımlamak için kullanıyoruz. `app/schemas/` klasöründe ReservationCreate, UserLogin, MenuItemResponse gibi şemaları Pydantic ile oluşturduk. Gelen verilerin doğruluğunu otomatik kontrol ediyor.

---

### Python-Jose
JWT (JSON Web Token) oluşturma ve doğrulama için kullanılır. Kullanıcı kimlik doğrulama sisteminin temelini oluşturur.

**Projede Kullanımı:** Kullanıcı giriş yaptığında JWT token oluşturuyoruz. Bu token ile kullanıcının kimliğini doğrulayıp korumalı endpoint'lere erişim sağlıyoruz. Token 24 saat geçerli kalıyor.

---

### Passlib + Bcrypt
Şifre hashleme ve doğrulama için kullanılan güvenlik kütüphaneleridir. Kullanıcı şifrelerini güvenli şekilde saklamak için bcrypt algoritmasını kullanır.

**Projede Kullanımı:** Kullanıcı kayıt olduğunda şifreyi bcrypt ile hashleyip veritabanına kaydediyoruz. Giriş sırasında girilen şifreyi hash ile karşılaştırarak doğrulama yapıyoruz.

---

### Python-SocketIO
WebSocket tabanlı gerçek zamanlı iletişim için kullanılır. Çift yönlü anlık veri iletimi sağlar.

**Projede Kullanımı:** Mutfak ekranına anlık sipariş bildirimleri göndermek için kullanıyoruz. Yeni sipariş geldiğinde veya sipariş durumu değiştiğinde tüm bağlı cihazlara anında bildirim gidiyor.

---

### SlowAPI
Rate limiting (hız sınırlama) için kullanılır. API endpoint'lerini kötüye kullanıma karşı korur.

**Projede Kullanımı:** API'ye aşırı istek gönderilmesini engellemek için kullanıyoruz. Belirli sürede yapılabilecek istek sayısını sınırlayarak sunucuyu koruyoruz.

---

### Python-Dotenv
Ortam değişkenlerini `.env` dosyasından okumak için kullanılır.

**Projede Kullanımı:** Veritabanı bağlantı bilgileri, JWT secret key, LLM API URL gibi hassas konfigürasyonları `.env` dosyasında saklıyoruz. Kod içinde bu değerleri güvenli şekilde okuyoruz.

---

### Colorlog
Renkli ve okunabilir log çıktıları için kullanılır.

**Projede Kullanımı:** Backend loglarını renkli ve seviyeye göre (INFO, WARNING, ERROR) farklı renklerde gösteriyoruz. Geliştirme sırasında hata ayıklamayı kolaylaştırıyor.

---

## ⚛️ Frontend Teknolojileri

### React 18
Facebook tarafından geliştirilen, bileşen tabanlı JavaScript UI kütüphanesidir. Virtual DOM kullanarak performanslı render sağlar.

**Projede Kullanımı:** Üç ayrı frontend uygulaması (Customer App, Admin Panel, Kitchen Display) React ile geliştirildi. Component bazlı mimari ile yeniden kullanılabilir UI parçaları oluşturduk.

---

### TypeScript
JavaScript'in tip güvenli (type-safe) üst kümesidir. Derleme zamanında hata yakalama ve daha iyi IDE desteği sağlar.

**Projede Kullanımı:** Tüm frontend kodları TypeScript ile yazıldı. MenuItem, Reservation, User gibi interface'ler tanımlayarak tip güvenliği sağlıyoruz. IDE'de otomatik tamamlama ve hata yakalama aktif.

---

### Vite
Yeni nesil frontend build aracıdır. Geleneksel bundler'lara göre çok daha hızlı geliştirme sunucusu sağlar.

**Projede Kullanımı:** Tüm React uygulamalarını Vite ile build ediyoruz. Geliştirme sırasında anında hot reload, production için optimize edilmiş bundle oluşturma işlemlerini Vite yönetiyor.

---

### React Router DOM
React uygulamalarında sayfa yönlendirme (routing) için kullanılır.

**Projede Kullanımı:** Customer App'te Ana Sayfa, Menü, Rezervasyon, Chatbot gibi sayfalar arası geçişi yönetiyoruz. Admin Panel'de Dashboard, Masalar, Siparişler, Menü gibi sekmeleri route'lar ile organize ettik.

---

### Axios
HTTP istekleri için kullanılan Promise tabanlı kütüphanedir.

**Projede Kullanımı:** Frontend'den Backend API'ye tüm HTTP isteklerini Axios ile yapıyoruz. Rezervasyon oluşturma, menü çekme, kullanıcı girişi gibi tüm API çağrıları Axios interceptor'ları ile yönetiliyor.

---

### Socket.IO Client
Gerçek zamanlı, çift yönlü iletişim için WebSocket istemcisidir.

**Projede Kullanımı:** Kitchen Display'de anlık sipariş güncellemelerini almak için kullanıyoruz. Backend'den yeni sipariş geldiğinde ekran otomatik güncelleniyor.

---

### Recharts
React için deklaratif ve composable grafik kütüphanesidir.

**Projede Kullanımı:** Admin Panel'de günlük/haftalık sipariş istatistikleri, gelir grafikleri, popüler menü öğeleri gibi analitik grafikleri Recharts ile oluşturuyoruz.

---

### TailwindCSS
Utility-first CSS framework'üdür. Önceden tanımlanmış CSS sınıfları ile hızlı stil oluşturmayı sağlar.

**Projede Kullanımı:** Tüm UI stillerini TailwindCSS class'ları ile yazıyoruz. Responsive tasarım (`md:`, `lg:`), hover efektleri (`hover:`), dark mode gibi özellikleri kullanarak modern arayüz oluşturduk.

---

### PostCSS
CSS dönüştürme aracıdır. TailwindCSS ve autoprefixer gibi eklentilerle çalışır.

**Projede Kullanımı:** TailwindCSS'i derlemek ve CSS dosyalarını işlemek için build pipeline'da kullanıyoruz.

---

### Autoprefixer
CSS kurallarına tarayıcı ön eklerini otomatik ekler.

**Projede Kullanımı:** Yazdığımız CSS'in tüm modern tarayıcılarda (Chrome, Firefox, Safari, Edge) tutarlı çalışmasını sağlamak için kullanıyoruz.

---

### ESLint
JavaScript/TypeScript için statik kod analiz aracıdır.

**Projede Kullanımı:** Kod kalitesini kontrol etmek ve tutarlı kod stili sağlamak için kullanıyoruz. Commit öncesi hataları yakalayıp düzeltiyoruz.

---

## 🗄️ Veritabanı

### PostgreSQL 15
Güçlü, açık kaynaklı ilişkisel veritabanı yönetim sistemidir. ACID uyumluluğu, JSON desteği ve gelişmiş sorgu optimizasyonu sunar.

**Projede Kullanımı:** Tüm uygulama verilerini (kullanıcılar, masalar, menü öğeleri, rezervasyonlar, siparişler) PostgreSQL'de saklıyoruz. İlişkisel yapı sayesinde foreign key'ler ile veri bütünlüğünü koruyoruz.

---

## 🐳 Containerization & DevOps

### Docker
Uygulamaları container'lar içinde paketleme ve çalıştırma platformudur.

**Projede Kullanımı:** Her servis (backend, frontend'ler, database) için ayrı Dockerfile oluşturduk. Bu sayede "benim bilgisayarımda çalışıyor" problemini ortadan kaldırıyoruz.

---

### Docker Compose
Çoklu Docker container'larını tanımlama ve yönetme aracıdır.

**Projede Kullanımı:** `docker-compose up` komutu ile tüm servisleri (PostgreSQL, Backend, Customer App, Admin Panel, Kitchen Display) tek seferde başlatıyoruz. Servisler arası network bağlantıları ve environment variable'lar otomatik yapılandırılıyor.

---

## 🤖 AI / LLM Entegrasyonu

### LM Studio (Local LLM)
Yerel bilgisayarda çalışan yapay zeka modellerini barındıran uygulamadır. OpenAI API uyumlu endpoint sağlar.

**Projede Kullanımı:** AI Chatbot özelliği için kullanıyoruz. Müşteriler chatbot ile Türkçe konuşarak menü hakkında bilgi alabilir, rezervasyon yapmak için yardım isteyebilir. Model tamamen yerel çalıştığı için veri gizliliği korunuyor.

---

## 🧪 Test Araçları

### Pytest
Python için güçlü ve esnek test framework'üdür.

**Projede Kullanımı:** Backend API endpoint'lerini test etmek için kullanıyoruz. User authentication, reservation creation, menu CRUD gibi işlevleri unit test ve integration test ile doğruluyoruz.

---

### Pytest-Asyncio
Async/await yapısındaki Python kodlarını test etmek için Pytest eklentisidir.

**Projede Kullanımı:** FastAPI'nin async endpoint'lerini test ederken async test fonksiyonları yazmamızı sağlıyor.

---

### HTTPX
Modern, async HTTP istemcisidir.

**Projede Kullanımı:** Test dosyalarında API endpoint'lerine HTTP isteği göndermek için kullanıyoruz. FastAPI'nin TestClient'ı ile entegre çalışıyor.

---

## 📁 Proje Yapısı

```
restaurant-reservation-system/
├── backend/                 # Python FastAPI Backend
│   ├── app/
│   │   ├── models/         # SQLAlchemy Modelleri (User, Table, MenuItem, vb.)
│   │   ├── routers/        # API Endpoint'leri (auth, reservations, menu, vb.)
│   │   ├── schemas/        # Pydantic Şemaları (Request/Response modelleri)
│   │   └── utils/          # Yardımcı Fonksiyonlar (auth, database, vb.)
│   ├── requirements.txt    # Python Bağımlılıkları
│   └── Dockerfile
│
├── frontend/
│   ├── customer-app/       # Müşteri Uygulaması (Rezervasyon, Menü, Chatbot)
│   └── admin-panel/        # Admin Paneli (Dashboard, Yönetim Araçları)
│
├── kitchen-display/        # Mutfak Ekranı (Anlık Sipariş Takibi)
│
├── docker-compose.yml      # Tüm Servislerin Orkestrasyonu
└── TECHNOLOGIES.md         # Bu Dokümantasyon
```

---

## 🔗 Port Yapılandırması

| Servis | Port | Açıklama |
|--------|------|----------|
| Backend API | 7001 | FastAPI REST API - Tüm iş mantığı burada |
| Customer App | 7002 | Müşteri Web Uygulaması - Rezervasyon ve menü |
| Admin Panel | 7003 | Yönetim Paneli - Masa, sipariş, menü yönetimi |
| Kitchen Display | 7004 | Mutfak Ekranı - Anlık sipariş görüntüleme |
| PostgreSQL | 7005 | Veritabanı - Tüm veriler burada |
| LM Studio | 1234 | AI/LLM API - Chatbot için |

---

## 📚 Versiyon Bilgileri

| Teknoloji | Versiyon |
|-----------|----------|
| Python | 3.11+ |
| Node.js | 18+ |
| FastAPI | 0.109.0 |
| React | 18.2.0 |
| TypeScript | 5.3.3 |
| PostgreSQL | 15 |
| TailwindCSS | 3.4.0 |
| Vite | 5.0.10 |
| Docker Compose | 3.8 |

---

*Bu dokümantasyon Borcelle Fine Dining Restaurant Reservation System projesi için hazırlanmıştır.*
