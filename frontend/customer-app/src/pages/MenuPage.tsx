import { useState, useEffect } from 'react';
import api from '../services/api';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  available: boolean;
  dietaryTags: string[];
  preparationTime: number;
}

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'appetizers', label: 'Appetizers' },
    { value: 'mains', label: 'Main Course' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'drinks', label: 'Drinks' },
    { value: 'specials', label: 'Chef Specials' },
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
    const emojiMap: Record<string, string> = {
      appetizers: '🥗',
      mains: '🍽️',
      desserts: '🍰',
      drinks: '🥤',
      specials: '⭐',
    };
    return emojiMap[category] || '🍴';
  };

  const getDietaryTagColor = (tag: string) => {
    const colorMap: Record<string, string> = {
      vegetarian: 'bg-green-100 text-green-800',
      vegan: 'bg-green-100 text-green-800',
      'gluten-free': 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[tag] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-xl text-gray-100">
            Discover our delicious selection of dishes made with fresh, local ingredients
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedCategory === category.value
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-6xl">{getCategoryEmoji(item.category)}</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <span className="text-lg font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  {item.description && (
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {Array.isArray(item.dietaryTags) && item.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-xs px-2 py-1 rounded-full ${getDietaryTagColor(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    Prep time: {item.preparationTime} mins
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;

