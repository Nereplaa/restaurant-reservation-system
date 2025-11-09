import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ReservationsPage from './pages/ReservationsPage';
import CustomersPage from './pages/CustomersPage';
import TablesPage from './pages/TablesPage';
import MenuPage from './pages/MenuPage';
import OrdersPage from './pages/OrdersPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes with Sidebar Layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex min-h-screen bg-gray-100">
                  <Sidebar />
                  <div className="flex-1 overflow-x-hidden">
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/reservations" element={<ReservationsPage />} />
                      <Route path="/customers" element={<CustomersPage />} />
                      <Route path="/tables" element={<TablesPage />} />
                      <Route path="/menu" element={<MenuPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

