import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import Quran from './pages/quran';
import Salah from './pages/Salah';
import Holidays from './pages/Holidays';
import Athkar from './pages/Athkar';
import InstallButton from './components/InstallButton';

const PlaceholderPage = ({ title }) => {
  return (
    <div style={{ 
      padding: '120px 20px', 
      textAlign: 'center',
      minHeight: '100vh'
    }}>
      <h1>{title}</h1>
      <p style={{ marginTop: '20px', opacity: 0.6 }}>Coming Soon... 🚀</p>
    </div>
  );
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quran" element={<Quran />} />
        <Route path="/athkar" element={<Athkar />} />
        <Route path="/salah" element={<Salah />} />
        <Route path="/holidays" element={<Holidays />} />
      </Routes>
      <MobileNav />
      <InstallButton />
    </>
  );
}

export default App;