import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router } from 'react-router-dom';
import OceaniqueRoute from './Routes'
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content */}
          <main className="container mx-auto my-auto px-4 py-4">
            <OceaniqueRoute />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
