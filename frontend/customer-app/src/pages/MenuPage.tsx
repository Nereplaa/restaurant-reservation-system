import { useState, useEffect } from 'react';
import api from '../services/api';
import { MenuItem } from '../types';

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    { value: 'all', label: 'Tümü', labelEn: 'All Items', emoji: '🍽️' },
    { value: 'soups', label: 'Çorbalar', labelEn: 'Soups', emoji: '🥣' },
    { value: 'appetizers', label: 'Mezeler', labelEn: 'Appetizers', emoji: '🥗' },
    { value: 'mains', label: 'Ana Yemekler', labelEn: 'Main Dishes', emoji: '🍛' },
    { value: 'kebabs', label: 'Kebaplar', labelEn: 'Kebabs', emoji: '🍖' },
    { value: 'grills', label: 'Izgara', labelEn: 'Grills', emoji: '🔥' },
    { value: 'desserts', label: 'Tatlılar', labelEn: 'Desserts', emoji: '🍰' },
    { value: 'drinks', label: 'İçecekler', labelEn: 'Drinks', emoji: '🥤' },
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/menu?available=true');
      if (response.data.success) {
        setMenuItems(response.data.data.items);
      }
    } catch (err: any) {
      setError('Failed to load menu items');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const getCategoryEmoji = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.emoji || '🍴';
  };

  const getDietaryTagColor = (tag: string) => {
    const colorMap: Record<string, string> = {
      vegetarian: 'bg-green-100 text-green-800',
      vegan: 'bg-emerald-100 text-emerald-800',
      'gluten-free': 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[tag] || 'bg-gray-100 text-gray-800';
  };

  const openDetailModal = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const closeDetailModal = () => {
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Menü yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-8 py-6 rounded-lg shadow-lg">
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-4">🍽️ Menümüz</h1>
          <p className="text-xl text-orange-100">
            Türk mutfağının geleneksel lezzetleri | Traditional Turkish Cuisine
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md ${
                selectedCategory === category.value
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50'
              }`}
            >
              <span className="mr-2">{category.emoji}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-500 text-xl">Bu kategoride ürün bulunmamaktadır</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
                onClick={() => openDetailModal(item)}
              >
                <div className="h-56 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.nameTr || item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-8xl mb-2">{getCategoryEmoji(item.category)}</span>
                      <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                        Fotoğraf yakında
                      </span>
                    </div>
                  )}
                  {item.calories && (
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {item.calories} kcal
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {item.nameTr || item.name}
                      </h3>
                      {item.nameTr && item.name !== item.nameTr && (
                        <p className="text-sm text-gray-500 italic">{item.name}</p>
                      )}
                    </div>
                    <span className="text-2xl font-bold text-red-600">
                      ₺{item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                  )}

                  {/* Nutritional Info Preview */}
                  {(item.protein || item.carbs || item.fat) && (
                    <div className="flex gap-3 mb-4 text-xs">
                      {item.protein && (
                        <div className="bg-blue-50 px-2 py-1 rounded">
                          <span className="font-semibold text-blue-700">P:</span> {item.protein}g
                        </div>
                      )}
                      {item.carbs && (
                        <div className="bg-yellow-50 px-2 py-1 rounded">
                          <span className="font-semibold text-yellow-700">C:</span> {item.carbs}g
                        </div>
                      )}
                      {item.fat && (
                        <div className="bg-orange-50 px-2 py-1 rounded">
                          <span className="font-semibold text-orange-700">F:</span> {item.fat}g
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(item.dietaryTags) && item.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-3 py-1 rounded-full font-medium ${getDietaryTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="w-5 h-5 mr-1 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {item.preparationTime} dk
                    </div>
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      Detaylar →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeDetailModal}>
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <div className="h-80 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                {selectedItem.imageUrl ? (
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.nameTr || selectedItem.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-9xl">{getCategoryEmoji(selectedItem.category)}</span>
                )}
              </div>
              <button
                onClick={closeDetailModal}
                className="absolute top-4 right-4 bg-white text-gray-700 rounded-full p-3 shadow-lg hover:bg-gray-100 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    {selectedItem.nameTr || selectedItem.name}
                  </h2>
                  {selectedItem.nameTr && selectedItem.name !== selectedItem.nameTr && (
                    <p className="text-lg text-gray-500 italic">{selectedItem.name}</p>
                  )}
                </div>
                <span className="text-3xl font-bold text-red-600">
                  ₺{selectedItem.price.toFixed(2)}
                </span>
              </div>

              {selectedItem.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Açıklama</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedItem.description}</p>
                </div>
              )}

              {selectedItem.detailedInfo && (
                <div className="mb-6 bg-orange-50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">📖 Detaylı Bilgi</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedItem.detailedInfo}</p>
                </div>
              )}

              {/* Nutritional Information */}
              {selectedItem.calories && (
                <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    Besin Değerleri
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                      <div className="text-3xl font-bold text-orange-600">{selectedItem.calories}</div>
                      <div className="text-sm text-gray-600 mt-1">Kalori (kcal)</div>
                    </div>
                    {selectedItem.protein && (
                      <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                        <div className="text-3xl font-bold text-blue-600">{selectedItem.protein}</div>
                        <div className="text-sm text-gray-600 mt-1">Protein (g)</div>
                      </div>
                    )}
                    {selectedItem.carbs && (
                      <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                        <div className="text-3xl font-bold text-yellow-600">{selectedItem.carbs}</div>
                        <div className="text-sm text-gray-600 mt-1">Karbonhidrat (g)</div>
                      </div>
                    )}
                    {selectedItem.fat && (
                      <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                        <div className="text-3xl font-bold text-red-600">{selectedItem.fat}</div>
                        <div className="text-sm text-gray-600 mt-1">Yağ (g)</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-sm text-gray-500">Hazırlık Süresi</div>
                      <div className="font-semibold">{selectedItem.preparationTime} dakika</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center text-gray-700">
                    <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="text-sm text-gray-500">Durum</div>
                      <div className="font-semibold text-green-600">Mevcut</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dietary Tags */}
              {Array.isArray(selectedItem.dietaryTags) && selectedItem.dietaryTags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">🌱 Özel Diyet</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedItem.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className={`px-4 py-2 rounded-full font-medium ${getDietaryTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={closeDetailModal}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Kapat
                </button>
                <button className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-orange-700 transition shadow-lg">
                  Sipariş Ver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;
