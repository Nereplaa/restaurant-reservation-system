import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// TODO: Import pages when created
// import HomePage from './pages/HomePage';
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
// etc...

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-primary mb-4">
                  Restaurant Reservation System
                </h1>
                <p className="text-gray-600 mb-8">
                  Customer App - TODO: Implement pages
                </p>
                <div className="space-y-2 text-left max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                  <h2 className="font-semibold text-lg mb-3">Pages to implement:</h2>
                  <ul className="space-y-1 text-gray-700">
                    <li>✅ Project structure created</li>
                    <li>⏳ HomePage</li>
                    <li>⏳ LoginPage</li>
                    <li>⏳ RegisterPage</li>
                    <li>⏳ BookingPage (with AI chatbot)</li>
                    <li>⏳ MyReservationsPage</li>
                    <li>⏳ MenuPage</li>
                    <li>⏳ ProfilePage</li>
                  </ul>
                </div>
              </div>
            </div>
          } />
          {/* Add routes here as you create pages */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

