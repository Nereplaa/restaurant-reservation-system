function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-green-400 mb-4">
            Kitchen Display System
          </h1>
          <p className="text-gray-300 mb-8 text-xl">
            Real-time Order Management
          </p>
          <div className="space-y-2 text-left max-w-md mx-auto bg-gray-800 p-6 rounded-lg">
            <h2 className="font-semibold text-lg mb-3">Features to implement:</h2>
            <ul className="space-y-1 text-gray-300">
              <li>✅ Project structure created</li>
              <li>⏳ WebSocket connection to backend</li>
              <li>⏳ Real-time order display</li>
              <li>⏳ Order status updates</li>
              <li>⏳ Order queue management</li>
              <li>⏳ Audio notifications</li>
              <li>⏳ Order timer</li>
              <li>⏳ Touch-friendly UI</li>
              <li>⏳ Fullscreen mode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

