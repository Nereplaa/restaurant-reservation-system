import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">🍽️ Restaurant</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Home
              </Link>
              <Link
                to="/menu"
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition"
              >
                Menu
              </Link>
              {user && (
                <>
                  <Link
                    to="/booking"
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Book Table
                  </Link>
                  <Link
                    to="/reservations"
                    className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    My Reservations
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm">
                  Hello, <span className="font-semibold">{user.firstName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

