import React, { useEffect } from 'react';
import { FaHeartbeat } from 'react-icons/fa';

const HeroSection = () => {
  useEffect(() => {
    // Load Lottie player script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="hero-section">
      <div className="hero-banner">
        <div className="hero-content">
          <div className="hero-text">
            {/* Title */}
            <h2>
              <i className="fas fa-heartbeat"></i> Healthcare AI Linked Operations
            </h2>
            
            {/* Animation */}
            <lottie-player 
              src="https://assets4.lottiefiles.com/packages/lf20_w51pcehl.json" 
              background="transparent" 
              speed="1" 
              style={{width: '260px', height: '200px'}} 
              loop 
              autoplay>
            </lottie-player>

            {/* Description */}
            <p>Experience AI-driven medical solutions at your fingertips.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
