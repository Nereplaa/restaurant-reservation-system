import React, { useState, useEffect } from 'react';
import { fetchMenuItems, fetchCategories, toLegacyFormat, toLegacyCategoryFormat, LegacyMenuItem, LegacyCategory } from '../services/menuApi';

interface Category {
  title: string;
  items: LegacyMenuItem[];
}

const MenuPage: React.FC = () => {
  const [menuItems, setMenuItems] = useState<LegacyMenuItem[]>([]);
  const [categoryList, setCategoryList] = useState<LegacyCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredItem, setHoveredItem] = useState<LegacyMenuItem | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [_loading, setLoading] = useState(true);

  // Load menu data from API on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [items, categories] = await Promise.all([
          fetchMenuItems(),
          fetchCategories()
        ]);
        setMenuItems(toLegacyFormat(items));
        setCategoryList(toLegacyCategoryFormat(categories));
      } catch (error) {
        console.error('Error loading menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Group items by category
  const getGroupedItems = (): Record<string, Category> => {
    const grouped: Record<string, Category> = {};

    // Only show available items
    const availableItems = menuItems.filter(item => item.available);

    availableItems.forEach(item => {
      if (!grouped[item.category]) {
        const catInfo = categoryList.find(c => c.key === item.category);
        grouped[item.category] = {
          title: catInfo?.label || item.category,
          items: []
        };
      }
      grouped[item.category].items.push(item);
    });

    return grouped;
  };

  const getFilteredCategories = (): [string, Category][] => {
    const grouped = getGroupedItems();

    if (selectedCategory === 'all') {
      // Order by categoryList order
      const orderedCategories: [string, Category][] = [];
      categoryList.forEach(cat => {
        if (grouped[cat.key]) {
          orderedCategories.push([cat.key, grouped[cat.key]]);
        }
      });
      return orderedCategories;
    }

    if (grouped[selectedCategory]) {
      return [[selectedCategory, grouped[selectedCategory]]];
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
            {categoryList.map((cat) => {
              const hasItems = menuItems.some(i => i.category === cat.key && i.available);
              if (!hasItems) return null;
              return (
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
              );
            })}
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

        {menuItems.filter(i => i.available).length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center mx-auto mb-4 text-3xl">
              🍽️
            </div>
            <p className="text-white/50 text-lg">Menüde henüz ürün bulunmuyor</p>
            <p className="text-white/30 text-sm mt-2">Yakında lezzetli seçenekler eklenecek</p>
          </div>
        )}
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
              {hoveredItem.image ? (
                <img
                  src={hoveredItem.image}
                  alt={hoveredItem.name}
                  className="w-full h-full object-cover"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl opacity-30">🍽️</div>
              )}
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
