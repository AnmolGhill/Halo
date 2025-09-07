import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <div className="sidebar-services">
        
        {/* 1. Healthcare Chatbot */}
        <button className="service-btn chatbot-btn" onClick={() => navigate('/chatbot')}>
          <span className="icon"><i className="fas fa-robot"></i></span>
          <div className="service-content">
            <h3>Healthcare Chatbot</h3>
            <p>24/7 AI-powered medical assistance</p>
          </div>
        </button>

        {/* 2. Doctor Preference (Online) */}
        <button className="service-btn doctor-btn" onClick={() => navigate('/doctor')}>
          <span className="icon"><i className="fas fa-user-md"></i></span>
          <div className="service-content">
            <h3>Doctor Preference (Online)</h3>
            <p>Select your preferred online doctor</p>
          </div>
        </button>

        {/* 3. Medicine Recognition */}
        <button className="service-btn medicine-btn" onClick={() => navigate('/medicine')}>
          <span className="icon"><i className="fas fa-pills"></i></span>
          <div className="service-content">
            <h3>Medicine Recognition</h3>
            <p>Identify medications instantly</p>
          </div>
        </button>

        {/* 4. EQ Assessment */}
        <button className="service-btn eq-btn" onClick={() => navigate('/eq-test')}>
          <span className="icon"><i className="fas fa-brain"></i></span>
          <div className="service-content">
            <h3>EQ Assessment</h3>
            <p>Evaluate emotional intelligence</p>
          </div>
        </button>

      </div>
    </div>
  );
};

export default Sidebar;
