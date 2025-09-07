import React from 'react';
import { FaPills, FaArrowCircleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Medicine = () => {
  const navigate = useNavigate();

  const medicines = [
    {
      name: 'Paracetamol 500mg',
      description: 'For fever and mild pain relief'
    },
    {
      name: 'Amoxicillin 250mg',
      description: 'Antibiotic for bacterial infections'
    },
    {
      name: 'Omeprazole 20mg',
      description: 'Reduces stomach acid, treats heartburn'
    }
  ];

  return (
    <div className="main-container">
      <div className="content">
        <div className="account-section">
          <h2>
            <FaPills /> Medicine Prescription Service
          </h2>

          {/* Service Unavailable Notice */}
          <div style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            border: '1px solid #ffeeba',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p>
              <strong>Note:</strong> This service is currently{' '}
              <span style={{ fontWeight: 'bold', color: '#d63333' }}>
                not provided by HALO
              </span>.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: '10px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                padding: '10px 15px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              <FaArrowCircleLeft style={{ marginRight: '6px' }} />
              Return to Dashboard
            </button>
          </div>

          {/* Sample Medicine Cards */}
          {medicines.map((medicine, index) => (
            <div key={index} style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              padding: '16px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
              marginBottom: '20px',
              transition: 'transform 0.2s'
            }}>
              <h4 style={{
                margin: '0 0 5px',
                color: '#333'
              }}>
                {medicine.name}
              </h4>
              <p style={{
                margin: '0',
                fontSize: '14px',
                color: '#555'
              }}>
                {medicine.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Medicine;
