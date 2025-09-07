import React from 'react';

const ServiceDescriptions = () => {
  return (
    <div className="service-descriptions">

      {/* Healthcare Chatbot Descriptions */}
      <div className="service-description">
        <h3><i className="fas fa-robot"></i> Healthcare Chatbot</h3>
        <p>Our AI-powered chatbot provides instant medical guidance, symptom analysis, and healthcare recommendations. Available 24/7, it offers reliable preliminary medical advice while maintaining complete privacy.</p>
      </div>
    
      {/* Medicine Recognition Descriptions */}
      <div className="service-description">
        <h3><i className="fas fa-pills"></i> Medicine Recognition</h3>
        <p>Advanced medicine identification system that helps you recognize medications, understand their uses, proper dosage, and potential side effects. Simply upload a photo of your medication for instant information.</p>
      </div>
    
      {/* EQ Assessment Description */}
      <div className="service-description">
        <h3><i className="fas fa-brain"></i> EQ Assessment</h3>
        <p>Professional emotional intelligence evaluation tool that helps assess and improve your emotional awareness, empathy, and social skills. Get personalized insights and development recommendations.</p>
      </div>
      
    </div>
  );
};

export default ServiceDescriptions;
