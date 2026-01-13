import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { fetchSettings, RestaurantSettings } from '../services/menuApi';

// Default settings fallback
const defaultSettings: Partial<RestaurantSettings> = {
  name: 'Borcelle Fine Dining',
  slogan: 'Fine Dining • 2004',
  heroVideoUrl: 'https://www.youtube.com/embed/F3zw1Gvn4Mk?autoplay=1&mute=1&loop=1&playlist=F3zw1Gvn4Mk&controls=0&modestbranding=1&rel=0&playsinline=1&showinfo=0',
  heroTitle: 'Borcelle Fine Dining',
  heroSubtitle: 'Zamansız zarafet, titiz servis ve şefin imzasını taşıyan tabaklar…\nHer detay fine-dining sofralarına yakışır bir ritüele dönüşür.',
  heroBadges: ['Tadım Menüsü', 'Şefin Seçkisi', 'Rezervasyon Önerilir'],
  openingTime: '11:00',
  closingTime: '23:00',
  address: 'Merkez Mah. Lüks Sokak No:1, İstanbul',
  phone: '+90 (212) 555 01 23',
  galleryImages: ['fined1.webp', 'fined2.jpeg', 'fined3.webp', 'fined4.webp'],
  mission: 'En nadide hammaddeleri rafine tekniklerle buluşturarak, her tabakta sanat eseri yaratmak. Misafirlerimize tutarlı lezzet ve kusursuz servis standardı sunmak.',
  vision: 'Modern gastronomi anlayışını zamansız bir atmosferle birleştirerek, Türkiye\'nin en prestijli fine-dining deneyimini sunmak.',
  experience: 'Sakin bir lüks atmosferi, özenle tasarlanmış ambiyans ve mevsimin en taze ürünleriyle hazırlanan tadım menüsü. Her kurs, şefin yaratıcılığının bir yansıması.',
  philosophy: '"Az ama öz" yaklaşımıyla, her detayda mükemmellik arayışı. Yemeğin ötesinde, unutulmaz anılar biriktirdiğiniz bir mekan.',
  features: [
    { icon: '🍽️', title: 'Ustalık & Lezzet', description: 'Michelin yıldızlı mutfaklardan ilham alan şefimiz, en seçkin malzemelerle damağınızda iz bırakan tatlar yaratıyor. Her tabak, bir sanat eseri.' },
    { icon: '✨', title: 'Zarif Atmosfer', description: 'Özenle tasarlanmış iç mekan, yumuşak aydınlatma ve klasik müzik eşliğinde romantik akşam yemeklerinden iş görüşmelerine ideal ortam.' },
    { icon: '⭐', title: 'Kusursuz Hizmet', description: 'Deneyimli ekibimiz, her misafirimize özel ilgi göstererek beklentilerin ötesinde bir deneyim sunmak için titizlikle çalışıyor.' }
  ]
};

const HomePage = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<Partial<RestaurantSettings>>(defaultSettings);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        if (data) {
          // Merge with defaults for any missing fields
          setSettings({ ...defaultSettings, ...data });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    loadSettings();
  }, []);

  // Helper to get setting value with fallback
  const s = settings;
  const galleryImages = s.galleryImages && s.galleryImages.length > 0
    ? s.galleryImages
    : defaultSettings.galleryImages!;
  const features = s.features && s.features.length > 0
    ? s.features
    : defaultSettings.features!;
  const heroBadges = s.heroBadges && s.heroBadges.length > 0
    ? s.heroBadges
    : defaultSettings.heroBadges!;

  return (
    <div className="min-h-screen bg-premium">
      {/* Fixed Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl border border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
              <img src="/images/logo.png" alt="BORCELLE" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-playfair font-semibold text-white tracking-[0.14em] uppercase text-sm">
                {s.name?.split(' ')[0] || 'BORCELLE'}
              </span>
              <span className="text-[10px] tracking-[0.10em] uppercase text-[#9aa3b2]">
                {s.slogan || 'Fine Dining • 2004'}
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link to="/" className="text-white/80 text-xs tracking-[0.12em] uppercase px-4 py-2 rounded-full hover:text-white hover:bg-white/10 transition-all">
              Anasayfa
            </Link>
            <Link to="/menu" className="text-white/80 text-xs tracking-[0.12em] uppercase px-4 py-2 rounded-full hover:text-white hover:bg-white/10 transition-all">
              Menü
            </Link>
            {user ? (
              <>
                <Link to="/reservations" className="text-white/80 text-xs tracking-[0.12em] uppercase px-4 py-2 rounded-full hover:text-white hover:bg-white/10 transition-all">
                  Rezervasyonlarım
                </Link>
                <Link to="/booking" className="ml-2 bg-[#cfd4dc]/20 border border-[#cfd4dc]/30 text-white text-xs tracking-[0.12em] uppercase px-5 py-2.5 rounded-full font-medium hover:bg-[#cfd4dc]/30 transition-all">
                  Rezervasyon Yap
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white/80 text-xs tracking-[0.12em] uppercase px-4 py-2 rounded-full hover:text-white hover:bg-white/10 transition-all">
                  Giriş
                </Link>
                <Link to="/register" className="ml-2 bg-[#cfd4dc]/20 border border-[#cfd4dc]/30 text-white text-xs tracking-[0.12em] uppercase px-5 py-2.5 rounded-full font-medium hover:bg-[#cfd4dc]/30 transition-all">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Video */}
      <header className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0f18]">
          <iframe
            src={s.heroVideoUrl || defaultSettings.heroVideoUrl}
            title="BORCELLE video"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[180vh] pointer-events-none"
            style={{ filter: 'saturate(1.2) contrast(1.1) brightness(0.9)' }}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0f1a2b]/60 via-[#0f1a2b]/40 to-[#0f1a2b]" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto pt-16">
          <h1 className="font-playfair font-medium text-white text-5xl md:text-7xl mb-6 leading-tight" style={{ textShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
            {s.heroTitle || s.name || 'Borcelle Fine Dining'}
          </h1>
          <p className="text-white/85 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-8" style={{ textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
            {(s.heroSubtitle || defaultSettings.heroSubtitle)?.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </p>

          {/* Badges */}
          <div className="flex gap-3 justify-center flex-wrap mb-10">
            {heroBadges.map((badge, i) => (
              <span key={i} className="border border-white/25 bg-white/5 text-white/90 px-5 py-2.5 rounded-full text-xs tracking-[0.10em] uppercase backdrop-blur-md">
                {badge}
              </span>
            ))}
          </div>

          {/* CTA Button */}
          <Link to={user ? '/booking' : '/register'} className="inline-block bg-[#cfd4dc]/20 border border-[#cfd4dc]/30 text-white text-sm tracking-[0.10em] uppercase px-8 py-4 rounded-full font-medium hover:bg-[#cfd4dc]/30 transition-all shadow-2xl">
            Masanızı Ayırtın
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </header>

      {/* Mission & Vision Section - Dark Theme */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-playfair font-medium text-white text-sm tracking-[0.14em] uppercase whitespace-nowrap">
            Misyon & Vizyon
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#cfd4dc]/80 to-transparent" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-dark rounded-2xl p-8 border border-white/10">
            <p className="text-xs tracking-[0.14em] uppercase text-[#7b8698] mb-3">Misyonumuz</p>
            <p className="text-white/80 leading-relaxed font-light">
              {s.mission || defaultSettings.mission}
            </p>
            <div className="h-6" />
            <p className="text-xs tracking-[0.14em] uppercase text-[#7b8698] mb-3">Vizyonumuz</p>
            <p className="text-white/80 leading-relaxed font-light">
              {s.vision || defaultSettings.vision}
            </p>
          </div>

          <div className="glass-dark rounded-2xl p-8 border border-white/10">
            <p className="text-xs tracking-[0.14em] uppercase text-[#7b8698] mb-3">Deneyim</p>
            <p className="text-white/80 leading-relaxed font-light">
              {s.experience || defaultSettings.experience}
            </p>
            <div className="h-6" />
            <p className="text-xs tracking-[0.14em] uppercase text-[#7b8698] mb-3">Felsefemiz</p>
            <p className="text-white/80 leading-relaxed font-light">
              {s.philosophy || defaultSettings.philosophy}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section - NEDEN BIZ - Dark Theme */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-playfair font-medium text-white text-sm tracking-[0.14em] uppercase whitespace-nowrap">
            Neden Biz
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#cfd4dc]/80 to-transparent" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div key={i} className="glass-dark rounded-2xl p-8 text-center border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1">
              <div className={`w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br ${i === 0 ? 'from-[#cfd4dc]/20 to-[#cfd4dc]/5 border-white/10' :
                  i === 1 ? 'from-amber-500/20 to-amber-600/10 border-amber-500/20' :
                    'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20'
                } border flex items-center justify-center`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>
              <h3 className="font-playfair font-semibold text-white text-xl mb-4">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions - Dark Theme */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-playfair font-medium text-white text-sm tracking-[0.14em] uppercase whitespace-nowrap">
            Keşfedin
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#cfd4dc]/80 to-transparent" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/menu" className="glass-dark rounded-2xl p-10 border border-white/10 transition-all hover:border-white/20 hover:scale-[1.02] group">
            <div className="w-14 h-14 mb-5 rounded-xl bg-gradient-to-br from-[#cfd4dc]/20 to-[#cfd4dc]/5 border border-white/10 flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
            <h3 className="font-playfair font-semibold text-white text-2xl mb-3">
              Menümüzü Keşfedin
            </h3>
            <p className="text-white/60 leading-relaxed">
              Başlangıçlardan tatlılara, özenle seçilmiş şarap koleksiyonumuzdan
              imza kokteyillerimize kadar tüm lezzetlerimizi inceleyin.
            </p>
          </Link>

          <Link to={user ? '/booking' : '/register'} className="glass-dark rounded-2xl p-10 border border-white/10 transition-all hover:border-white/20 hover:scale-[1.02] group">
            <div className="w-14 h-14 mb-5 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <h3 className="font-playfair font-semibold text-white text-2xl mb-3">
              Rezervasyon Yapın
            </h3>
            <p className="text-white/60 leading-relaxed">
              Özel günleriniz için masanızı şimdiden ayırtın.
              Romantik akşam yemekleri, kutlamalar veya iş toplantıları için idealiz.
            </p>
          </Link>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-playfair font-medium text-white text-sm tracking-[0.14em] uppercase whitespace-nowrap">
            Galeri
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#cfd4dc]/80 to-transparent" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((img, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl group border border-white/10">
              <img
                src={`/images/${img}`}
                alt={`${s.name || 'BORCELLE'} ${i + 1}`}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                style={{ filter: 'contrast(1.05) saturate(1.1)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a2b]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* Contact Info - Dark Theme */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="glass-dark rounded-2xl p-12 text-center border border-white/10">
          <h2 className="font-playfair font-semibold text-white text-3xl mb-6">
            Sizi Bekliyoruz
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-white/60 mb-8">
            <div className="text-center">
              <p className="text-xs tracking-[0.12em] uppercase text-[#7b8698] mb-2">Çalışma Saatleri</p>
              <p className="font-playfair font-medium text-white text-lg">
                Her Gün {s.openingTime || '11:00'} - {s.closingTime || '23:00'}
              </p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-xs tracking-[0.12em] uppercase text-[#7b8698] mb-2">Adres</p>
              <p className="font-medium text-white/80">{s.address || defaultSettings.address}</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-xs tracking-[0.12em] uppercase text-[#7b8698] mb-2">İletişim</p>
              <p className="font-medium text-white/80">{s.phone || defaultSettings.phone}</p>
            </div>
          </div>
          <Link to={user ? '/booking' : '/register'} className="inline-block bg-[#cfd4dc]/20 border border-[#cfd4dc]/30 text-white text-sm tracking-[0.10em] uppercase px-8 py-4 rounded-full font-medium hover:bg-[#cfd4dc]/30 transition-all">
            Rezervasyon Yapın
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center bg-[#0a0f18]">
        <p className="text-[#7b8698] text-xs tracking-[0.12em]">
          © 2004 - {new Date().getFullYear()} <span className="text-white font-medium">{s.name?.split(' ')[0]?.toUpperCase() || 'BORCELLE'}</span> Fine Dining
        </p>
        <p className="text-[#556070] text-xs mt-2">Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
};

export default HomePage;
