import './App.css'
import Navbar from './components/Navbar'
import AdminSidebar from './components/admin_page/AdminSidebar';
import { BrowserRouter as Router } from 'react-router-dom';
import OceaniqueRoute from './Routes'
import { AuthProvider, useAuth } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Router>
          <Layout />
        </Router>
      </AuthProvider>
    </I18nProvider>
  );
}

const Layout = () => {
  const { isAdmin, isCust } = useAuth();

  // Customer Layout
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="container mx-auto px-4 py-4">
          <OceaniqueRoute />
        </main>
      </div>
    );
  }

  // Admin Layout
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1">
            <OceaniqueRoute />
          </main>
        </div>
      </div>
    );
  }

  // Fallback to customer layout
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-4">
        <OceaniqueRoute />
      </main>
    </div>
  );
};

export default App;