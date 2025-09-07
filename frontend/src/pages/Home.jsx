import React, { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import HeroSection from '../components/HeroSection';
import HealthOverview from '../components/HealthOverview';
import ServiceDescriptions from '../components/ServiceDescriptions';

const Home = () => {
  useEffect(() => {
    // Create cherry blossoms periodically
    const createCherryBlossom = () => {
      const blossom = document.createElement('div');
      blossom.className = 'cherry-blossom';
      blossom.style.left = Math.random() * 100 + 'vw';
      blossom.style.animationDuration = (Math.random() * 3 + 2) + 's';
      document.body.appendChild(blossom);
      setTimeout(() => blossom.remove(), 5000);
    };

    const interval = setInterval(createCherryBlossom, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-container">
      <Sidebar />
      <div className="content">
        <HeroSection />
        <HealthOverview />
        <ServiceDescriptions />
      </div>
    </div>
  );
};

export default Home;
