import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">
                  Admin Panel
                </h1>
                <p className="text-gray-600 mb-8">
                  Restaurant Management System
                </p>
                <div className="space-y-2 text-left max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                  <h2 className="font-semibold text-lg mb-3">Pages to implement:</h2>
                  <ul className="space-y-1 text-gray-700">
                    <li>✅ Project structure created</li>
                    <li>⏳ LoginPage</li>
                    <li>⏳ DashboardPage (with charts)</li>
                    <li>⏳ ReservationsPage</li>
                    <li>⏳ CustomersPage</li>
                    <li>⏳ TablesPage</li>
                    <li>⏳ MenuPage</li>
                    <li>⏳ OrdersPage</li>
                    <li>⏳ SettingsPage</li>
                  </ul>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

