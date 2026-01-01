import React, { useState } from 'react';

// MenuItem type definition
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  calories: number;
  image: string;
  tags?: string[];
  priceNote?: string;
}

interface Category {
  title: string;
  items: MenuItem[];
}

interface MenuData {
  [key: string]: Category;
}

// Static menu data from the HTML template
const menuData: MenuData = {
  starters: {
    title: 'Başlangıçlar',
    items: [
      {
        id: 1,
        name: 'Zeytin & Kekikli Artizan Ekmek Trio',
        description: 'Sıcak taş fırın ekmekleri, zeytinyağı–balsamik dip sos ve deniz tuzu ile.',
        price: 220,
        calories: 220,
        image: '/images/menu/Başlangıçlar/Zeytin & Kekikli Artizan Ekmek Trio.png',
      },
      {
        id: 2,
        name: 'Izgara Halloumi & Nar Roka',
        description: 'Nar ekşili roka yatağında ızgara hellim, kavrulmuş fındık parçaları ile.',
        price: 260,
        calories: 310,
        image: '/images/menu/Başlangıçlar/Izgara Halloumi & Nar Roka.png',
      },
      {
        id: 3,
        name: 'Trüf Aromalı Mantarlı Bruschetta',
        description: 'Karamelize soğan, sote mantar ve hafif trüf yağı ile kızarmış ekmek üstü lezzet.',
        price: 240,
        calories: 270,
        image: '/images/menu/Başlangıçlar/Trüf Aromalı Mantarlı Bruschetta.png',
      },
      {
        id: 4,
        name: 'Somon Tartar Lime Breeze',
        description: 'Taze somon, avokado, lime sos ve susam ile rafine bir soğuk başlangıç.',
        price: 320,
        calories: 260,
        image: '/images/menu/Başlangıçlar/Somon Tartar Lime Breeze.png',
      },
      {
        id: 5,
        name: 'Kabak Çiçeği Dolması Serisi',
        description: 'Otlu pirinç iç harcı ile doldurulmuş hafif Ege klasiği. (4 adet)',
        price: 230,
        calories: 190,
        tags: ['Vejetaryen'],
        image: '/images/menu/Başlangıçlar/Kabak Çiçeği Dolması Serisi.png',
      },
    ],
  },
  mains: {
    title: 'Ana Yemekler',
    items: [
      {
        id: 6,
        name: 'Borcelle Signature Steak',
        description: '250 gr dry-aged dana antrikot, demi-glace sos, ızgara sebzeler ve patates püresi ile.',
        price: 780,
        calories: 720,
        image: '/images/menu/Ana Yemekler/Borcelle Signature Steak.png',
      },
      {
        id: 7,
        name: 'Kremalı Porçini Risotto',
        description: 'Parmesan ve tereyağı ile bağlanmış, yoğun aromalı porçini mantarlı risotto.',
        price: 520,
        calories: 580,
        tags: ['Vejetaryen'],
        image: '/images/menu/Ana Yemekler/Kremalı Porçini Risotto.png',
      },
      {
        id: 8,
        name: 'Deniz Mahsullü Linguine',
        description: 'Karides, midye ve kalamarla zenginleştirilmiş, beyaz şarap soslu ince makarna.',
        price: 560,
        calories: 650,
        image: '/images/menu/Ana Yemekler/Deniz Mahsullü Linguine.png',
      },
      {
        id: 9,
        name: 'Ballı Hardallı Fırın Somon',
        description: 'Kinoa yatağında narenciye dokunuşlu ballı hardal sos ile fırınlanmış somon.',
        price: 590,
        calories: 520,
        image: '/images/menu/Ana Yemekler/Ballı Hardallı Fırın Somon.png',
      },
      {
        id: 10,
        name: 'Osmanlı Usulü Kuzu İncik',
        description: '8 saat düşük ısıda pişirilmiş kuzu incik, patlıcan püresi ve kendi sosu ile.',
        price: 640,
        calories: 780,
        image: '/images/menu/Ana Yemekler/Osmanlı Usulü Kuzu İncik.png',
      },
      {
        id: 11,
        name: 'Vegan Izgara Köz Tabağı',
        description: 'Köz patlıcan, kabak, kapya biber ve humus ile dengeli bir bitkisel ana yemek.',
        price: 450,
        calories: 470,
        tags: ['Vegan'],
        image: '/images/menu/Ana Yemekler/Vegan Izgara Köz Tabağı.png',
      },
    ],
  },
  pizzas: {
    title: 'Gurme Pizzalar',
    items: [
      {
        id: 12,
        name: 'Truffle Mushroom Pizza',
        description: 'Mozzarella, mantar ve trüf yağı ile yoğun aromalı gurme pizza.',
        price: 430,
        calories: 690,
        image: '/images/menu/Gurme Pizzalar/Truffle Mushroom Pizza.png',
      },
      {
        id: 13,
        name: 'Napoli Margherita Deluxe',
        description: 'San Marzano domates sosu, buffalo mozzarella ve taze fesleğen.',
        price: 390,
        calories: 610,
        tags: ['Vejetaryen'],
        image: '/images/menu/Gurme Pizzalar/Napoli Margherita Deluxe.png',
      },
      {
        id: 14,
        name: 'Prosciutto & Roka',
        description: 'İnce dilim prosciutto, roka ve parmesan ile dengeli tuzlulukta.',
        price: 460,
        calories: 720,
        image: '/images/menu/Gurme Pizzalar/Prosciutto & Roka.png',
      },
      {
        id: 15,
        name: 'Quattro Formaggi',
        description: 'Gorgonzola, mozzarella, parmesan ve kaşar karışımı peynir şöleni.',
        price: 440,
        calories: 780,
        image: '/images/menu/Gurme Pizzalar/Quattro Formaggi.png',
      },
    ],
  },
  chef: {
    title: 'Şef Özel',
    items: [
      {
        id: 16,
        name: 'Karamelize Soğanlı T-Bone',
        description: '350 gr premium T-Bone, karamelize soğan ve rosmarinli patatesler ile.',
        price: 890,
        calories: 950,
        image: '/images/menu/Şef Özel/Karamelize Soğanlı T-Bone.png',
      },
      {
        id: 17,
        name: 'Borcelle Fileto Sufle',
        description: 'Şarap indirgemeli sos ile tereyağında mühürlenmiş dana fileto.',
        price: 840,
        calories: 860,
        image: '/images/menu/Şef Özel/Borcelle Fileto Sufle.png',
      },
      {
        id: 18,
        name: 'Kestane Püreli Ördek Göğsü',
        description: 'Portakal glaze ve kestane püresi ile dengelenmiş gurme ördek tabağı.',
        price: 820,
        calories: 740,
        image: '/images/menu/Şef Özel/Kestane Püreli Ördek Göğsü.png',
      },
    ],
  },
  desserts: {
    title: 'Tatlılar',
    items: [
      {
        id: 19,
        name: 'Çikolatalı Volkan Sufle',
        description: 'Akışkan bitter çekirdek, yanında dondurma ile servis edilir.',
        price: 260,
        calories: 480,
        image: '/images/menu/Tatlılar/Çikolatalı Volkan Sufle.png',
      },
      {
        id: 20,
        name: 'San Sebastian Cheesecake',
        description: 'Orta şekerli, kremamsı dokuda klasik yanık cheesecake.',
        price: 270,
        calories: 510,
        image: '/images/menu/Tatlılar/San Sebastian Cheesecake.png',
      },
      {
        id: 21,
        name: 'Limonlu Mascarpone Cup',
        description: 'Limon kreması, mascarpone ve bisküvi katmanlı ferahlatıcı tatlı.',
        price: 240,
        calories: 390,
        image: '/images/menu/Tatlılar/Limonlu Mascarpone Cup.png',
      },
      {
        id: 22,
        name: 'Fıstıklı Kadayıf Parfe',
        description: 'Antep fıstığı, kıtır kadayıf ve parfe katmanlarıyla modernleştirilmiş yerel tat.',
        price: 280,
        calories: 520,
        image: '/images/menu/Tatlılar/Fıstıklı Kadayıf Parfe.png',
      },
    ],
  },
  drinks: {
    title: 'İçecekler',
    items: [
      {
        id: 23,
        name: 'Taze Portakal Suyu',
        description: 'Sıkma günlük portakal suyu.',
        price: 120,
        calories: 120,
        image: '/images/menu/İçecekler/Taze Portakal Suyu.png',
      },
      {
        id: 24,
        name: 'Ev Yapımı Limonata',
        description: 'Buzlu, naneli seçenekleriyle hafif ekşi-dengeli lezzet.',
        price: 110,
        calories: 140,
        image: '/images/menu/İçecekler/Ev Yapımı Limonata.png',
      },
      {
        id: 25,
        name: 'Şeftalili Soğuk Çay',
        description: 'Demlenmiş çay bazlı, şeftali aromalı ferah içecek.',
        price: 105,
        calories: 110,
        image: '/images/menu/İçecekler/Şeftalili Soğuk Çay.png',
      },
      {
        id: 26,
        name: 'Türk Kahvesi',
        description: 'Klasik, orta kavrum Türk kahvesi.',
        price: 80,
        calories: 5,
        image: '/images/menu/İçecekler/Türk Kahvesi.png',
      },
      {
        id: 27,
        name: 'Cappuccino',
        description: 'Yoğun espresso ve süt köpüğü ile.',
        price: 95,
        calories: 80,
        image: '/images/menu/İçecekler/Cappuccino.png',
      },
      {
        id: 28,
        name: 'Latte',
        description: 'Yumuşak içimli, süt oranı yüksek kahve.',
        price: 105,
        calories: 120,
        image: '/images/menu/İçecekler/Latte.png',
      },
      {
        id: 29,
        name: 'Sade Soda',
        description: 'Gazlı mineral içecek.',
        price: 60,
        calories: 0,
        image: '/images/menu/İçecekler/Sade Soda.png',
      },
    ],
  },
  wines: {
    title: 'Şarap Koleksiyonu',
    items: [
      {
        id: 30,
        name: 'Château Elegante Reserva',
        description: 'Yoğun tanenli, karadut ve siyah erik notalarına sahip gövdeli kırmızı.',
        price: 1700,
        calories: 125,
        tags: ['Kırmızı', 'Şişe'],
        image: '/images/menu/Şarap Koleksiyonu/Château Elegante Reserva.png',
      },
      {
        id: 31,
        name: 'Borcelle Cabernet Special',
        description: 'Meşe fıçıda dinlendirilmiş, baharat ve siyah meyve notaları taşıyan özel harman.',
        price: 950,
        calories: 130,
        tags: ['Kırmızı'],
        priceNote: 'Kadeh 210₺',
        image: '/images/menu/Şarap Koleksiyonu/Borcelle Cabernet Special.png',
      },
      {
        id: 32,
        name: 'Pinot Noir Rosé Serenade',
        description: 'Çilek ve narenciye profiline sahip, hafif gövdeli taze roze.',
        price: 850,
        calories: 115,
        tags: ['Roze'],
        priceNote: 'Kadeh 190₺',
        image: '/images/menu/Şarap Koleksiyonu/Pinot Noir Rosé Serenade.png',
      },
      {
        id: 33,
        name: 'Sauvignon Blanc Crystal',
        description: 'Tropik meyve ve bitkisel notalara sahip, yüksek asiditeli ferah beyaz şarap.',
        price: 900,
        calories: 105,
        tags: ['Beyaz'],
        priceNote: 'Kadeh 190₺',
        image: '/images/menu/Şarap Koleksiyonu/Sauvignon Blanc Crystal.png',
      },
      {
        id: 34,
        name: 'Chardonnay Gold Barrel',
        description: 'Vanilya ve tereyağı hissi barındıran, tam gövdeli fıçı Chardonnay.',
        price: 1100,
        calories: 120,
        tags: ['Beyaz'],
        priceNote: 'Kadeh 230₺',
        image: '/images/menu/Şarap Koleksiyonu/Chardonnay Gold Barrel.png',
      },
      {
        id: 35,
        name: 'Prosecco Stella',
        description: 'İnce kabarcıklı, hafif tatlı bitişli İtalyan prosecco.',
        price: 820,
        calories: 98,
        tags: ['Köpüklü'],
        priceNote: 'Kadeh 180₺',
        image: '/images/menu/Şarap Koleksiyonu/Prosecco Stella.png',
      },
      {
        id: 36,
        name: 'Champagne Maison Royale',
        description: 'Özel anlar için önerilen, dengeli asiditeye sahip prestijli Champagne.',
        price: 4800,
        calories: 95,
        tags: ['Köpüklü', 'Şişe'],
        image: '/images/menu/Şarap Koleksiyonu/Champagne Maison Royale.png',
      },
    ],
  },
};

const categoryList = [
  { key: 'starters', label: 'Başlangıçlar', emoji: '🥗' },
  { key: 'mains', label: 'Ana Yemekler', emoji: '🍛' },
  { key: 'pizzas', label: 'Gurme Pizzalar', emoji: '🍕' },
  { key: 'chef', label: 'Şef Özel', emoji: '👨‍🍳' },
  { key: 'desserts', label: 'Tatlılar', emoji: '🍰' },
  { key: 'drinks', label: 'İçecekler', emoji: '🥤' },
  { key: 'wines', label: 'Şaraplar', emoji: '🍷' },
];

const MenuPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredItem, setHoveredItem] = useState<MenuItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const getFilteredCategories = (): [string, Category][] => {
    if (selectedCategory === 'all') {
      return Object.entries(menuData);
    }
    if (menuData[selectedCategory]) {
      return [[selectedCategory, menuData[selectedCategory]]];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-premium" onMouseMove={handleMouseMove}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0f1a2b] to-[#16233a] text-white py-16 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-xs uppercase tracking-[0.4em] text-white/50 mb-3">BORCELLE</div>
          <h1 className="font-playfair text-4xl md:text-5xl font-medium tracking-wide text-[#cfd4dc] mb-3">
            Gourmet Menu
          </h1>
          <p className="text-white/50 text-sm italic">
            Fine Dining · Seasonal Selection · Chef's Signature
          </p>
          {/* Decorative divider */}
          <div className="mt-6 w-36 h-px bg-gradient-to-r from-transparent via-[#cfd4dc]/60 to-transparent mx-auto relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full border border-[#cfd4dc]/30 bg-[#0f1a2b] flex items-center justify-center text-xs text-[#cfd4dc]/60">✶</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-30 bg-[#0f1a2b]/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all'
                  ? 'bg-[#cfd4dc]/20 border border-[#cfd4dc]/40 text-white shadow-lg'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
                }`}
            >
              🍽️ Tümü
            </button>
            {categoryList.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.key
                    ? 'bg-[#cfd4dc]/20 border border-[#cfd4dc]/40 text-white shadow-lg'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
                  }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {getFilteredCategories().map(([key, category]) => (
          <section key={key} className="mb-16">
            {/* Section Title */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-[#cfd4dc]/40 to-transparent"></div>
              <h2 className="font-playfair text-2xl text-[#cfd4dc] tracking-wider uppercase">
                {category.title}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-[#cfd4dc]/40 to-transparent"></div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="group relative glass-dark rounded-xl border border-white/10 p-5 cursor-pointer transition-all duration-300 hover:border-[#cfd4dc]/30 hover:bg-white/5 hover:shadow-xl"
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-medium text-white group-hover:text-[#cfd4dc] transition-colors uppercase tracking-wide text-sm">
                          {item.name}
                        </h3>
                        {item.tags && item.tags.map((tag: string) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-[#cfd4dc]/30 text-[#cfd4dc]/80">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-white/40 mb-2">
                        <span className="px-2 py-0.5 rounded-full border border-white/10">{item.calories} kcal</span>
                      </div>
                      <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-medium text-[#cfd4dc]">₺{item.price}</div>
                      {item.priceNote && (
                        <div className="text-xs text-white/40 mt-1">{item.priceNote}</div>
                      )}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-[#cfd4dc]/60 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Detay
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Floating Popup on Hover */}
      {hoveredItem && (
        <div
          className="fixed z-50 pointer-events-none animate-fade-in-up"
          style={{
            left: Math.min(mousePos.x + 20, typeof window !== 'undefined' ? window.innerWidth - 380 : 800),
            top: Math.min(mousePos.y - 100, typeof window !== 'undefined' ? window.innerHeight - 320 : 500),
          }}
        >
          <div className="w-[340px] glass-dark rounded-2xl border border-[#cfd4dc]/30 shadow-2xl overflow-hidden">
            {/* Image */}
            <div className="h-44 bg-gradient-to-br from-white/10 to-white/5 relative overflow-hidden">
              <img
                src={hoveredItem.image}
                alt={hoveredItem.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              {/* Calorie badge */}
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/20">
                🔥 {hoveredItem.calories} kcal
              </div>
              {/* Price overlay */}
              <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                <span className="text-xl font-medium text-[#cfd4dc]">₺{hoveredItem.price}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-playfair text-lg text-white mb-2">{hoveredItem.name}</h3>

              {/* Tags */}
              {hoveredItem.tags && hoveredItem.tags.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {hoveredItem.tags.map((tag: string) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-full bg-[#cfd4dc]/10 border border-[#cfd4dc]/20 text-[#cfd4dc]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description bar */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <p className="text-sm text-white/70 leading-relaxed">
                  {hoveredItem.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs text-white/30 uppercase tracking-[0.3em]">
            Borcelle Fine Dining · Tüm Fiyatlar KDV Dahildir
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
