import { useState, useEffect } from 'react';
import CustomSelect from '../components/CustomSelect';
import api from '../services/api';

// Types
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  image_url: string;
  category: string;
  dietary_tags: string[];
  available: boolean;
}

interface Category {
  id: string;
  key: string;
  label: string;
  emoji: string;
}

const availabilityOptions = [
  { value: 'true', label: 'Evet' },
  { value: 'false', label: 'Hayır' },
];

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    calories: 0,
    image_url: '',
    category: 'starters',
    dietary_tags: [],
    available: true,
  });

  // Load menu data from API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [menuRes, catRes] = await Promise.all([
        api.get('/menu'),
        api.get('/categories')
      ]);
      setMenuItems(menuRes.data || []);
      setCategories(catRes.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Menü verileri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map(c => ({ value: c.key, label: c.label }));

  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return menuItems;
    }
    return menuItems.filter(item => item.category === selectedCategory);
  };

  const getGroupedItems = () => {
    const groups: Record<string, MenuItem[]> = {};
    const items = getFilteredItems();
    items.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  };

  const getCategoryLabel = (key: string) => {
    return categories.find(c => c.key === key)?.label || key;
  };

  const getCategoryEmoji = (key: string) => {
    return categories.find(c => c.key === key)?.emoji || '🍽️';
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentItem({
      name: '',
      description: '',
      price: 0,
      calories: 0,
      image_url: '',
      category: 'starters',
      dietary_tags: [],
      available: true,
    });
    setShowModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setIsEditing(true);
    setCurrentItem({ ...item });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing && currentItem.id) {
        // Update existing item via API
        const response = await api.patch(`/menu/${currentItem.id}`, {
          name: currentItem.name,
          description: currentItem.description,
          price: currentItem.price,
          calories: currentItem.calories,
          category: currentItem.category,
          available: currentItem.available,
          dietary_tags: currentItem.dietary_tags || [],
        });

        setMenuItems(prev => prev.map(item =>
          item.id === currentItem.id ? response.data : item
        ));
      } else {
        // Create new item via API
        const response = await api.post('/menu', {
          name: currentItem.name,
          description: currentItem.description,
          price: currentItem.price,
          calories: currentItem.calories,
          category: currentItem.category,
          available: currentItem.available ?? true,
          dietary_tags: currentItem.dietary_tags || [],
        });

        setMenuItems(prev => [...prev, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Menü öğesi kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu menü öğesini silmek istediğinize emin misiniz?')) return;

    try {
      await api.delete(`/menu/${id}`);
      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert('Menü öğesi silinirken hata oluştu');
    }
  };

  const groupedItems = getGroupedItems();

  if (loading) {
    return (
      <div className="min-h-screen bg-premium flex items-center justify-center">
        <div className="text-white/60">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-premium">
      {/* Header */}
      <div className="border-b border-white/10 py-6 px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40 mb-1">Admin Panel</div>
            <h1 className="font-playfair text-3xl font-medium tracking-wide text-[#cfd4dc] m-0">
              Menü Yönetimi
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Menü öğelerini düzenleyin, ekleyin veya silin • Değişiklikler müşteri menüsüne anında yansır
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn-primary px-5 py-2.5 rounded-[14px] text-[13px] flex items-center gap-2"
          >
            <span className="text-lg">+</span> Yeni Öğe Ekle
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-20 bg-[#0f1a2b]/95 backdrop-blur-lg border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all'
                ? 'bg-[#cfd4dc]/20 border border-[#cfd4dc]/40 text-white shadow-lg'
                : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
                }`}
            >
              🍽️ Tümü ({menuItems.length})
            </button>
            {categories.map((cat) => {
              const count = menuItems.filter(i => i.category === cat.key).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.key
                    ? 'bg-[#cfd4dc]/20 border border-[#cfd4dc]/40 text-white shadow-lg'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
                    }`}
                >
                  {cat.emoji} {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="p-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <section key={category} className="mb-12">
            {/* Section Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-[#cfd4dc]/40 to-transparent"></div>
              <h2 className="font-playfair text-xl text-[#cfd4dc] tracking-wider uppercase">
                {getCategoryLabel(category)}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-l from-[#cfd4dc]/40 to-transparent"></div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`group relative glass-card rounded-xl border p-4 transition-all duration-300 
                    hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#cfd4dc]/10 
                    hover:border-[#cfd4dc]/40 hover:bg-gradient-to-br hover:from-white/10 hover:to-white/5
                    ${!item.available ? 'opacity-50 border-red-500/30' : 'border-white/10'}`}
                >
                  {/* Image */}
                  <div className="h-32 rounded-lg overflow-hidden mb-3 bg-gradient-to-br from-[#1a2a40] to-[#0d1520] relative">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 flex items-center justify-center ${item.image_url ? 'hidden' : ''}`}>
                      <span className="text-5xl opacity-60 group-hover:scale-110 transition-transform duration-300">
                        {getCategoryEmoji(item.category)}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-medium text-white text-sm leading-tight flex-1 group-hover:text-[#cfd4dc] transition-colors duration-300">
                      {item.name}
                    </h3>
                    <div className="text-[#cfd4dc] font-medium whitespace-nowrap group-hover:text-white transition-colors duration-300">₺{item.price}</div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                    <span className="px-2 py-0.5 rounded-full border border-white/10 group-hover:border-[#cfd4dc]/30 transition-colors duration-300">
                      {item.calories} kcal
                    </span>
                    {!item.available && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">Stokta Yok</span>
                    )}
                  </div>

                  {item.dietary_tags && item.dietary_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.dietary_tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full border border-[#cfd4dc]/30 text-[#cfd4dc]/80 group-hover:bg-[#cfd4dc]/10 transition-colors duration-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-white/40 text-xs line-clamp-2 mb-3 group-hover:text-white/60 transition-colors duration-300">
                    {item.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="flex-1 btn-secondary px-3 py-1.5 rounded-lg text-[11px] group-hover:bg-white/10 transition-colors duration-300"
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 rounded-lg text-[11px] bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {getFilteredItems().length === 0 && (
          <div className="text-center py-16 glass-panel rounded-2xl text-white/60">
            <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center mx-auto mb-4 text-3xl">
              🍽️
            </div>
            <p className="text-[15px]">Bu kategoride menü öğesi bulunamadı</p>
            <button onClick={openCreateModal} className="mt-4 btn-primary px-4 py-2 rounded-lg text-sm">
              + Yeni Öğe Ekle
            </button>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <h3 className="font-playfair text-xl font-medium text-white mb-6">
              {isEditing ? '✏️ Menü Öğesini Düzenle' : '➕ Yeni Menü Öğesi'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[11px] text-white/60 uppercase tracking-wider mb-1.5 block">İsim</label>
                <input
                  type="text"
                  value={currentItem.name || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  className="input-premium w-full"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-white/60 uppercase tracking-wider mb-1.5 block">Açıklama</label>
                <textarea
                  value={currentItem.description || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  className="input-premium w-full h-20 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-white/60 uppercase tracking-wider mb-1.5 block">Fiyat (₺)</label>
                  <input
                    type="number"
                    value={currentItem.price || 0}
                    onChange={(e) => setCurrentItem({ ...currentItem, price: Number(e.target.value) })}
                    className="input-premium w-full"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-white/60 uppercase tracking-wider mb-1.5 block">Kalori</label>
                  <input
                    type="number"
                    value={currentItem.calories || 0}
                    onChange={(e) => setCurrentItem({ ...currentItem, calories: Number(e.target.value) })}
                    className="input-premium w-full"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-white/60 uppercase tracking-wider mb-1.5 block">Kategori</label>
                <CustomSelect
                  options={categoryOptions}
                  value={currentItem.category || 'starters'}
                  onChange={(value) => setCurrentItem({ ...currentItem, category: value })}
                />
              </div>

              <div>
                <label className="text-[11px] text-white/60 uppercase tracking-wider mb-1.5 block">Stokta Mevcut</label>
                <CustomSelect
                  options={availabilityOptions}
                  value={String(currentItem.available ?? true)}
                  onChange={(value) => setCurrentItem({ ...currentItem, available: value === 'true' })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 btn-secondary py-2.5 rounded-[14px] font-medium"
                  disabled={saving}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary py-2.5 rounded-[14px] font-medium"
                  disabled={saving}
                >
                  {saving ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Ekle')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
