import { useState, useEffect } from 'react';
import api from '../services/api';
import { MenuItem } from '../types';

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    category: 'APPETIZER',
    price: 0,
    imageUrl: '',
    available: true,
    preparationTime: 15,
    dietaryTags: [],
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await api.get('/menu');
      // Backend returns array directly or wrapped in data
      const items = Array.isArray(response.data) ? response.data : (response.data.data || response.data);
      setMenuItems(items);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && currentItem.id) {
        await api.patch(`/menu/${currentItem.id}`, currentItem);
        fetchMenuItems();
        closeModal();
      } else {
        await api.post('/menu', currentItem);
        fetchMenuItems();
        closeModal();
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to save menu item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      await api.delete(`/menu/${id}`);
      fetchMenuItems();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete menu item');
    }
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentItem({
      name: '',
      description: '',
      category: 'APPETIZER',
      price: 0,
      imageUrl: '',
      available: true,
      preparationTime: 15,
      dietaryTags: [],
    });
    setShowModal(true);
  };

  const openEditModal = (item: MenuItem) => {
    setIsEditing(true);
    setCurrentItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const filteredItems = filterCategory === 'ALL'
    ? menuItems
    : menuItems.filter(item => item.category === filterCategory);

  const categories = ['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'BEVERAGE', 'SPECIAL'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white/80 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Topbar */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-playfair text-3xl font-medium tracking-wide text-white m-0">
            Menu
          </h1>
          <p className="text-white/[0.78] text-[13px] mt-1.5 font-light">
            Manage menu items
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn-primary px-4 py-2.5 rounded-[14px] text-[13px]"
        >
          + Add Menu Item
        </button>
      </div>

      {error && (
        <div className="glass-panel rounded-2xl p-4 mb-4 border-red-500/30 bg-red-500/10">
          ⚠️ {error}
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <button
          onClick={() => setFilterCategory('ALL')}
          className={`px-3 py-2 rounded-full text-[12px] tracking-wider uppercase transition-all ${filterCategory === 'ALL' ? 'btn-primary' : 'btn-secondary'
            }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-2 rounded-full text-[12px] tracking-wider uppercase transition-all ${filterCategory === cat ? 'btn-primary' : 'btn-secondary'
              }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="glass-card rounded-2xl overflow-hidden hover:border-[#cfd4dc]/30 transition-all">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover" />
            ) : (
              <div className="w-full h-40 bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-5xl">
                🍽️
              </div>
            )}

            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-medium text-white">{item.name}</h3>
                <span className={`badge text-[10px] ${item.available ? 'badge-ok' : 'badge-danger'}`}>
                  {item.available ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <p className="text-xs text-white/60 mb-3 line-clamp-2">{item.description}</p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-medium text-[#cfd4dc]">${item.price.toFixed(2)}</span>
                <span className="text-xs text-white/50">⏱️ {item.preparationTime} min</span>
              </div>

              <div className="mb-3">
                <span className="badge text-[10px]">
                  {item.category.replace('_', ' ')}
                </span>
              </div>

              {item.dietaryTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.dietaryTags.map((tag, idx) => (
                    <span key={idx} className="badge badge-ok text-[9px]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(item)}
                  className="flex-1 btn-secondary px-3 py-2 rounded-[12px] text-[12px]"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 btn-danger px-3 py-2 rounded-[12px] text-[12px]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-10 glass-panel rounded-2xl text-white/60">
          <div className="w-10 h-10 rounded-2xl border border-white/[0.14] bg-white/[0.06] flex items-center justify-center mx-auto mb-3">
            🍽️
          </div>
          <p className="text-[13px]">No menu items found</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-8">
          <div className="glass-card rounded-2xl p-6 max-w-2xl w-full mx-4 animate-fade-in-up">
            <h3 className="font-playfair text-xl font-medium text-white mb-6">
              {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={currentItem.name}
                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                    className="input-premium w-full"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={currentItem.description}
                    onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                    className="input-premium w-full resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={currentItem.category}
                    onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                    className="input-premium w-full"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={currentItem.price}
                    onChange={(e) => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) })}
                    className="input-premium w-full"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">Prep Time (min)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={currentItem.preparationTime}
                    onChange={(e) => setCurrentItem({ ...currentItem, preparationTime: parseInt(e.target.value) })}
                    className="input-premium w-full"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">Available</label>
                  <select
                    value={currentItem.available ? 'true' : 'false'}
                    onChange={(e) => setCurrentItem({ ...currentItem, available: e.target.value === 'true' })}
                    className="input-premium w-full"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
                    Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={currentItem.imageUrl || ''}
                    onChange={(e) => setCurrentItem({ ...currentItem, imageUrl: e.target.value })}
                    className="input-premium w-full"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 btn-primary px-4 py-3 rounded-[14px] font-medium"
                >
                  {isEditing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 btn-secondary px-4 py-3 rounded-[14px] font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
