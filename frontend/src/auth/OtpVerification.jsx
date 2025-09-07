import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const OtpVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const { phone, email } = location.state || {};

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6 && /^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (otpString === '123456') {
        toast.success('Phone number verified successfully!');
        navigate('/auth/login');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleResend = () => {
    if (!canResend) return;
    
    setResendTimer(30);
    setCanResend(false);
    toast.success('OTP sent successfully!');
  };

  const maskedPhone = phone ? phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : '';
  const maskedEmail = email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : '';

  return (
    <div style={{
      background: '#f0f4ff',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            📱
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '800',
            color: '#1f2937',
            margin: '0',
            marginBottom: '8px'
          }}>
            Verify Your Phone
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '16px',
            margin: '0',
            lineHeight: '1.5'
          }}>
            We've sent a 6-digit code to
            <br />
            <strong style={{ color: '#374151' }}>
              {maskedPhone || maskedEmail}
            </strong>
          </p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '32px'
          }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                style={{
                  width: '48px',
                  height: '56px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '24px',
                  fontWeight: '600',
                  textAlign: 'center',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  background: digit ? 'white' : '#f9fafb',
                  color: '#1f2937'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6366f1';
                  e.target.style.background = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = digit ? '#10b981' : '#e5e7eb';
                  e.target.style.background = digit ? 'white' : '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join('').length !== 6}
            style={{
              width: '100%',
              background: (isLoading || otp.join('').length !== 6) ? '#9ca3af' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: (isLoading || otp.join('').length !== 6) ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              if (!isLoading && otp.join('').length === 6) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
              }
            }}
            onMouseOut={(e) => {
              if (!isLoading && otp.join('').length === 6) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Verifying...
              </div>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        {/* Resend Section */}
        <div style={{
          fontSize: '14px',
          color: '#6b7280',
          marginBottom: '24px'
        }}>
          {canResend ? (
            <div>
              Didn't receive the code?{' '}
              <button
                onClick={handleResend}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6366f1',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  textDecoration: 'underline'
                }}
              >
                Resend OTP
              </button>
            </div>
          ) : (
            <div>
              Resend OTP in{' '}
              <span style={{
                color: '#6366f1',
                fontWeight: '600'
              }}>
                {resendTimer}s
              </span>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          color: '#0369a1',
          marginBottom: '24px'
        }}>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            💡 For testing purposes
          </div>
          Use OTP: <strong>123456</strong>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/auth/register')}
          style={{
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            margin: '0 auto'
          }}
        >
          ← Back to Registration
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .otp-container {
            padding: 20px !important;
            margin: 10px !important;
          }
          
          .otp-inputs {
            gap: 8px !important;
          }
          
          .otp-input {
            width: 40px !important;
            height: 48px !important;
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OtpVerification;
