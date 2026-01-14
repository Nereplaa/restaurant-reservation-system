# Borcelle Fine Dining - Teknoloji Dokümantasyonu

Bu dokümanda **Borcelle Fine Dining Restaurant Reservation System** projesinde kullanılan tüm teknolojiler detaylı şekilde açıklanmaktadır.

---

## Genel Bakış

| Katman | Teknoloji |
|--------|-----------|
| Backend | Python + FastAPI |
| Frontend | React + TypeScript |
| Veritabanı | PostgreSQL |
| Gerçek Zamanlı İletişim | WebSocket (Socket.IO) |
| Containerization | Docker |
| AI Entegrasyonu | LM Studio (Local LLM) |

---

## Backend Teknolojileri

### FastAPI
Modern, hızlı ve yüksek performanslı bir Python web framework'üdür. Otomatik API dokümantasyonu (Swagger/OpenAPI), tip güvenliği ve async/await desteği sunar.

**Projede Kullanımı:** Tüm backend API endpoint'lerini oluşturmak için kullanıldı. Rezervasyon, menü, kullanıcı, sipariş ve masa yönetimi API'leri FastAPI ile geliştirildi.

---

### Uvicorn
ASGI protokolünü destekleyen Python için yüksek performanslı bir web sunucusudur.

**Projede Kullanımı:** Backend sunucusunu çalıştırmak için kullanılıyor. Uygulama 7001 portunda çalışıyor.

---

### SQLAlchemy
Python için en popüler ORM (Object-Relational Mapping) kütüphanesidir.

**Projede Kullanımı:** User, Table, MenuItem, Reservation, Order gibi tüm veritabanı modellerini tanımlamak için kullanıldı.

---

### Alembic
SQLAlchemy için veritabanı migration aracıdır.

**Projede Kullanımı:** Veritabanı şema değişikliklerini yönetmek için kullanılıyor.

---

### Psycopg2
PostgreSQL veritabanı için Python adaptörüdür.

**Projede Kullanımı:** SQLAlchemy'nin PostgreSQL ile iletişim kurmasını sağlıyor.

---

### Pydantic
Veri doğrulama ve ayar yönetimi için kullanılan kütüphanedir.

**Projede Kullanımı:** API request ve response şemalarını tanımlamak için kullanıldı.

---

### Python-Jose
JWT (JSON Web Token) oluşturma ve doğrulama için kullanılır.

**Projede Kullanımı:** Kullanıcı kimlik doğrulama sisteminin temelini oluşturuyor. Token 24 saat geçerli.

---

### Passlib + Bcrypt
Şifre hashleme ve doğrulama için güvenlik kütüphaneleridir.

**Projede Kullanımı:** Kullanıcı şifreleri bcrypt ile hashlenerek veritabanına kaydediliyor.

---

### Python-SocketIO
WebSocket tabanlı gerçek zamanlı iletişim için kullanılır.

**Projede Kullanımı:** Mutfak ekranına anlık sipariş bildirimleri göndermek için kullanılıyor.

---

### SlowAPI
Rate limiting (hız sınırlama) için kullanılır.

**Projede Kullanımı:** API'ye aşırı istek gönderilmesini engellemek için kullanılıyor.

---

### Python-Dotenv
Ortam değişkenlerini `.env` dosyasından okumak için kullanılır.

**Projede Kullanımı:** Veritabanı bağlantı bilgileri, JWT secret key gibi konfigürasyonları yönetiyor.

---

## Frontend Teknolojileri

### React 18
Facebook tarafından geliştirilen, bileşen tabanlı JavaScript UI kütüphanesidir.

**Projede Kullanımı:** Üç ayrı frontend uygulaması (Customer App, Admin Panel, Kitchen Display) React ile geliştirildi.

---

### TypeScript
JavaScript'in tip güvenli üst kümesidir.

**Projede Kullanımı:** Tüm frontend kodları TypeScript ile yazıldı. Tip güvenliği ve IDE desteği sağlıyor.

---

### Vite
Yeni nesil frontend build aracıdır.

**Projede Kullanımı:** Tüm React uygulamalarını build etmek ve geliştirme sunucusu için kullanılıyor.

---

### React Router DOM
React uygulamalarında sayfa yönlendirme için kullanılır.

**Projede Kullanımı:** Tüm uygulamalarda sayfa geçişlerini yönetiyor.

---

### Axios
HTTP istekleri için Promise tabanlı kütüphanedir.

**Projede Kullanımı:** Frontend'den Backend API'ye tüm HTTP istekleri Axios ile yapılıyor.

---

### Socket.IO Client
Gerçek zamanlı, çift yönlü iletişim için WebSocket istemcisidir.

**Projede Kullanımı:** Kitchen Display'de anlık sipariş güncellemelerini almak için kullanılıyor.

---

### TailwindCSS
Utility-first CSS framework'üdür.

**Projede Kullanımı:** Tüm UI stilleri TailwindCSS class'ları ile yazıldı. Responsive tasarım desteği sağlıyor.

---

### Recharts
React için grafik kütüphanesidir.

**Projede Kullanımı:** Admin Panel'de istatistik grafikleri için kullanılıyor.

---

## Veritabanı

### PostgreSQL 15
Güçlü, açık kaynaklı ilişkisel veritabanı yönetim sistemidir.

**Projede Kullanımı:** Tüm uygulama verileri PostgreSQL'de saklanıyor.

---

## Containerization

### Docker
Uygulamaları container'lar içinde paketleme ve çalıştırma platformudur.

**Projede Kullanımı:** Her servis için ayrı Dockerfile oluşturuldu.

---

### Docker Compose
Çoklu Docker container'larını yönetme aracıdır.

**Projede Kullanımı:** Tüm servisler tek komutla başlatılabiliyor.

---

## AI/LLM Entegrasyonu

### LM Studio (Local LLM)
Yerel bilgisayarda çalışan yapay zeka modelleri için platformdur.

**Projede Kullanımı:** AI Chatbot özelliği için kullanılıyor. Müşteriler Türkçe konuşarak menü hakkında bilgi alabiliyor ve rezervasyon yardımı isteyebiliyor.

---

## Port Yapılandırması

| Servis | Port | Açıklama |
|--------|------|----------|
| Backend API | 7001 | FastAPI REST API |
| Customer App | 7002 | Müşteri Web Uygulaması |
| Admin Panel | 7003 | Yönetim Paneli |
| Kitchen Display | 7004 | Mutfak Ekranı |
| PostgreSQL | 7005 | Veritabanı |
| LM Studio | 1234 | AI/LLM API |

---

## Versiyon Bilgileri

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

*Kocaeli Sağlık ve Teknoloji Üniversitesi - 2026*
