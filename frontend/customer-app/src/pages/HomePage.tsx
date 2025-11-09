import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to The Restaurant
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Experience fine dining with exceptional service and delicious cuisine
            </p>
            <div className="flex justify-center space-x-4">
              {user ? (
                <Link
                  to="/booking"
                  className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition shadow-lg"
                >
                  Book a Table
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition shadow-lg"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="bg-transparent border-2 border-white hover:bg-white hover:text-primary px-8 py-3 rounded-lg text-lg font-semibold transition"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold mb-3">Fine Dining</h3>
            <p className="text-gray-600">
              Expertly crafted dishes using the finest ingredients from local suppliers
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-3">AI Booking Assistant</h3>
            <p className="text-gray-600">
              Book your table naturally with our intelligent chatbot - quick and easy
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="text-5xl mb-4">⭐</div>
            <h3 className="text-xl font-bold mb-3">Exceptional Service</h3>
            <p className="text-gray-600">
              Our dedicated staff ensures every visit is memorable and special
            </p>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              to="/menu"
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-8 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              <div className="text-4xl mb-3">📖</div>
              <h3 className="text-2xl font-bold mb-2">View Our Menu</h3>
              <p className="text-blue-100">
                Browse our delicious selection of appetizers, mains, desserts, and drinks
              </p>
            </Link>
            <Link
              to={user ? '/booking' : '/register'}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-8 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              <div className="text-4xl mb-3">📅</div>
              <h3 className="text-2xl font-bold mb-2">Make a Reservation</h3>
              <p className="text-green-100">
                Book your table online in seconds with our easy booking system
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gray-800 text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Opening Hours</h2>
          <p className="text-xl mb-6">Monday - Sunday</p>
          <p className="text-2xl font-semibold">11:00 AM - 10:00 PM</p>
          <div className="mt-8">
            <p className="text-lg">📍 123 Main Street, City, State 12345</p>
            <p className="text-lg">📞 +1 (234) 567-8900</p>
            <p className="text-lg">✉️ info@restaurant.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

