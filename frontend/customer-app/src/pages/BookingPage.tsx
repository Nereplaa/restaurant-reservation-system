import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const BookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    partySize: 2,
    specialRequest: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await api.post('/reservations', formData);
      if (response.data.success) {
        setSuccess('Reservation created successfully!');
        setTimeout(() => {
          navigate('/reservations');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to create reservation');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to make a reservation</h2>
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Generate time slots (11 AM to 9 PM, every 30 minutes)
  const timeSlots = [];
  for (let hour = 11; hour <= 21; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 21 && minute === 30) break; // Don't go past 9 PM
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      timeSlots.push({ value: time, label: displayTime });
    }
  }

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Make a Reservation</h1>
          <p className="text-xl text-gray-100">
            Book your table and enjoy a wonderful dining experience
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                min={today}
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <select
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a time</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="partySize" className="block text-sm font-medium text-gray-700 mb-2">
                Party Size *
              </label>
              <select
                id="partySize"
                name="partySize"
                required
                value={formData.partySize}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="specialRequest" className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests (Optional)
              </label>
              <textarea
                id="specialRequest"
                name="specialRequest"
                rows={4}
                value={formData.specialRequest}
                onChange={handleChange}
                placeholder="E.g., Window seat, birthday celebration, dietary restrictions..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <h4 className="font-semibold text-blue-900 mb-2">Important Information:</h4>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Reservations must be made at least 2 hours in advance</li>
                <li>You can book up to 30 days in advance</li>
                <li>Each reservation is for approximately 2 hours</li>
                <li>Cancellations must be made at least 2 hours before your reservation</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Reservation...' : 'Confirm Reservation'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* AI Booking Alternative */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">🤖 Try Our AI Booking Assistant</h3>
          <p className="mb-4">Book your table naturally with our intelligent chatbot</p>
          <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Chat with AI (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

