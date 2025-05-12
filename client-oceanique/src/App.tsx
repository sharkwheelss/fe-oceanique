import './App.css'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Signin from './components/SignIn';
import Signup from './components/SignUp';

function App() {

  // State to toggle between sign in and sign up pages
  const [currentPage, setCurrentPage] = useState('signin'); // 'signin' or 'signup'

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex">
        {currentPage === 'signin' ? <Signin /> : <Signup />}
      </main>
    </div>
  );
}

export default App
