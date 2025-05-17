import './App.css'
import Navbar from './components/Navbar'
import Signin from './components/SignIn';
import Signup from './components/SignUp';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NotFound from './components/NotFound';
import { Home, WhyOceaniqueSection } from './components/Home';
import Profile from './components/Profile';
import Beaches from './components/Beaches';
import BeachDetail from './components/BeachDetail';
import Events from './components/Events';
import Wishlist from './components/Wishlist';
import TransactionHistory from './components/TransactionHistory';
import Personality from './components/recommendation/Personality';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content */}
        <main className="container mx-auto my-auto px-4 py-4">
          <Routes>
            {/* Redirect to /home when the app is loaded */}
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={
              <div>
                <Home />
                <WhyOceaniqueSection />
              </div>
            } />
            <Route path="/personality" element={<Personality />} />
            <Route path="/beaches" element={<Beaches />} />
            <Route path="/beach-detail/:id" element={<BeachDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/transaction-history" element={<TransactionHistory />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
