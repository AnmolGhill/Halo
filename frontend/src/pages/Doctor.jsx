import React from 'react';
import { FaUserMd, FaArrowCircleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Doctor = () => {
  const navigate = useNavigate();

  const doctors = [
    {
      name: 'Dr. Ayesha Sharma',
      specialty: 'General Physician',
      status: 'online',
      available: true
    },
    {
      name: 'Dr. Rahul Verma',
      specialty: 'Cardiologist',
      status: 'offline',
      available: false
    },
    {
      name: 'Dr. Fatima Khan',
      specialty: 'Pediatrician',
      status: 'online',
      available: true
    }
  ];

  const selectDoctor = (name) => {
    toast.info(`You selected ${name} as your preferred doctor.`);
  };

  return (
    <div className="main-container">
      <div className="content">
        <div className="account-section">
          <h2>
            <FaUserMd /> Choose Your Preferred Doctor
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

          <div className="features" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            {doctors.map((doctor, index) => (
              <div key={index} className="feature" style={{
                background: 'white',
                padding: '1.8rem',
                borderRadius: '15px',
                boxShadow: '0 4px 12px rgba(255, 183, 197, 0.1)',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div className="feature-icon" style={{
                  fontSize: '2rem',
                  color: 'var(--accent)',
                  marginBottom: '1rem'
                }}>
                  <FaUserMd />
                </div>
                <h4 style={{
                  color: 'var(--accent)',
                  marginBottom: '1rem',
                  fontSize: '1.3rem'
                }}>
                  {doctor.name}
                </h4>
                <p style={{
                  color: 'var(--text)',
                  lineHeight: '1.6'
                }}>
                  {doctor.specialty}
                </p>
                <div className="status-indicator" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginTop: 'auto',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '8px'
                }}>
                  <div className={`status-dot ${doctor.status}`} style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: doctor.status === 'online' ? '#4CAF50' : '#f44336',
                    boxShadow: doctor.status === 'online' ? '0 0 8px #4CAF50' : '0 0 8px #f44336'
                  }}></div>
                  <span className="status-text" style={{
                    fontSize: '0.9rem',
                    color: 'var(--text)'
                  }}>
                    {doctor.status === 'online' ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="feature-footer" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1.5rem'
                }}>
                  <span className="badge" style={{
                    background: 'rgba(255, 183, 197, 0.2)',
                    color: 'var(--accent)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem'
                  }}>
                    {doctor.available ? 'Available Now' : 'Not Available'}
                  </span>
                  <button
                    className="btn-primary"
                    onClick={() => selectDoctor(doctor.name)}
                    disabled={!doctor.available}
                    style={{
                      opacity: doctor.available ? 1 : 0.5,
                      cursor: doctor.available ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctor;
