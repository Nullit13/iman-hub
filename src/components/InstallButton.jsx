import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaDownload } from 'react-icons/fa';

const InstallContainer = styled.div`
  position: fixed;
  bottom: ${({ isMobile }) => isMobile ? '100px' : '30px'};
  right: 20px;
  z-index: 1000;
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const InstallBtn = styled.button`
  background: ${({ dark }) => dark ? '#3CB371' : '#2E8B57'};
  color: white;
  border: none;
  padding: 16px 28px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 25px rgba(46, 139, 87, 0.5);
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 35px rgba(46, 139, 87, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 1.3rem;
  }
`;

const CloseBtn = styled.button`
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 0.9rem;
  cursor: pointer;
  position: absolute;
  top: -12px;
  right: -12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    background: rgba(0,0,0,0.8);
    transform: scale(1.1);
  }
`;

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) {
      setDarkMode(JSON.parse(saved));
    }

    const mobile = /iPhone|iPad|iPod|Android|Windows Phone/i.test(navigator.userAgent);
    setIsMobile(mobile);

    const handlePrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('Install prompt detected!');
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsVisible(false);
      console.log('App installed!');
    };

    window.addEventListener('appinstalled', handleInstalled);

    if (window.navigator.standalone) {
      setIsInstalled(true);
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        console.log('User choice:', result.outcome);
        if (result.outcome === 'accepted') {
          setIsInstalled(true);
          setIsVisible(false);
        }
        setDeferredPrompt(null);
      } catch (error) {
        console.error('Install error:', error);
      }
    }
  };

  if (isInstalled || !deferredPrompt || !isVisible) {
    return null;
  }

  return (
    <InstallContainer isMobile={isMobile}>
      <InstallBtn dark={darkMode} onClick={handleInstall}>
        <FaDownload /> Download App
      </InstallBtn>
      <CloseBtn onClick={() => setIsVisible(false)}>×</CloseBtn>
    </InstallContainer>
  );
};

export default InstallButton;