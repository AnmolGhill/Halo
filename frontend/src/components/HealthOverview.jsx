import React, { useState, useEffect } from 'react';

const HealthOverview = () => {
  const [healthData, setHealthData] = useState({
    weight: '70 kg',
    height: '175 cm',
    bloodType: 'O+'
  });

  return (
    <>
      {/* ============ Your Health Overview ============ */}
      
      {/* Health Information Section */}
      <div className="health-info">

        <div className="health-header">
          <h2><i className="fas fa-heartbeat"></i> Your Health Overview</h2>
          <div className="health-status"></div>
        </div>
        
        <div className="health-dashboard">

          {/* Main Health Status */}
          <div className="whb-container">

            {/* 1. Weight */}
            <div className="health-stat-card primary">
              <div className="stat-icon">
                <i className="fas fa-weight"></i>
              </div>
              <div className="stat-content">
                <h4>Weight</h4>
                <p className="stat-value" id="userWeight">{healthData.weight}</p>
                <div className="stat-trend positive"></div>
              </div>
            </div>

            {/* 2. Height */}
            <div className="health-stat-card">
              <div className="stat-icon">
                <i className="fas fa-ruler-vertical"></i>
              </div>
              <div className="stat-content">
                <h4>Height</h4>
                <p className="stat-value" id="userHeight">{healthData.height}</p>
                <div className="stat-trend neutral">
                </div>
              </div>
            </div>

            {/* 3. Blood Type */}
            <div className="health-stat-card">
              <div className="stat-icon">
                <i className="fas fa-tint"></i>
              </div>
              <div className="stat-content">
                <h4>Blood Type</h4>
                <p className="stat-value" id="userBloodType">{healthData.bloodType}</p>
                <div className="stat-info"></div>
              </div>
            </div>

          </div>

          {/* ========== Recent Medical History section ========== */}
           
          {/* Shadow Container for the Recent Medical History */}
          <div className="recent-medical-history-card">

            {/* Section Heading */}
            <h3><i className="fas fa-history"></i> Recent Medical History</h3>

            {/* Timeline container to hold all medical history events */}
            <div className="medical-history-timeline" id="userConditions">

              {/* 1. Event: Last Checkup */}
              <div className="medical-history-event">
                {/* Circular dot on the timeline */}
                <div className="event-dot"></div>
                {/* Content for the event */}
                <div className="event-details">
                  <h4>Last Checkup</h4>
                  <p>Regular health examination completed</p>
                  <span className="event-date">2 weeks ago</span>
                </div>
              </div>

              {/* 2. Event: Vaccination */}
              <div className="medical-history-event">
                {/* Circular dot on the timeline */}
                <div className="event-dot"></div>
                {/* Content for the event */}
                <div className="event-details">
                  <h4>Vaccination</h4>
                  <p>Annual flu shot administered</p>
                  <span className="event-date">1 month ago</span>
                </div>
              </div>

            </div>
          </div>
             

          {/* ============= Health Metrics Chart ============= */}

          {/* Shadow Container for the Health Metrics */}
          <div className="health-metrics">

            {/* Section Heading */}
            <h3><i className="fas fa-chart-line"></i> Health Metrics</h3>

            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-header">
                  <h4>BMI</h4>
                  <span className="metric-value">22.5</span>
                </div>
                <div className="metric-indicator">
                  <div className="indicator-bar" style={{width: '75%'}}></div>
                </div>
                <span className="metric-status">Normal</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default HealthOverview;
