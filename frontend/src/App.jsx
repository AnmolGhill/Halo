import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import Doctor from './pages/Doctor';
import Medicine from './pages/Medicine';
import EQTest from './pages/EQTest';
import Login from './auth/Login';
import Register from './auth/Register';
import OtpVerification from './auth/OtpVerification';

function AppContent() {
  const location = useLocation();
  const hiddenNavbarRoutes = ['/chatbot', '/auth/login', '/auth/register', '/auth/otp-verification'];
  const showNavbar = !hiddenNavbarRoutes.includes(location.pathname);

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/medicine" element={<Medicine />} />
        <Route path="/eq-test" element={<EQTest />} />
        <Route path="/health" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/otp-verification" element={<OtpVerification />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
