import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import chatbotService from '../services/chatbotService';

const Chatbot = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomInput, setSymptomInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I\'m your AI Health Assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const resultRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load conversation history if user is authenticated
    if (isAuthenticated) {
      loadConversationHistory();
    }
  }, [isAuthenticated]);

  const loadConversationHistory = async () => {
    try {
      const response = await chatbotService.getConversations();
      if (response.success && response.conversations.length > 0) {
        // Load the most recent conversation
        const recentConversation = response.conversations[0];
        const conversationResponse = await chatbotService.getConversation(recentConversation.id);
        if (conversationResponse.success) {
          setChatMessages(conversationResponse.conversation.messages || []);
        }
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const commonSymptoms = [
    { name: 'Headache', icon: '🤕', color: '#8b5cf6' },
    { name: 'Fever', icon: '🌡️', color: '#06b6d4' },
    { name: 'Cough', icon: '😷', color: '#10b981' },
    { name: 'Fatigue', icon: '😴', color: '#f59e0b' },
    { name: 'Nausea', icon: '🤢', color: '#ef4444' },
    { name: 'Sore Throat', icon: '🗣️', color: '#ec4899' },
    { name: 'Chest Pain', icon: '💔', color: '#6366f1' },
    { name: 'Dizziness', icon: '💫', color: '#8b5cf6' },
    { name: 'Runny Nose', icon: '🤧', color: '#10b981' },
    { name: 'Muscle Pain', icon: '💪', color: '#6366f1' }
  ];

  const sendMessage = async (message) => {
    if (!message.trim()) return;

    // Check for emergency keywords
    if (chatbotService.containsEmergencyKeywords(message)) {
      const emergencyResponse = chatbotService.getEmergencyResponse();
      setChatMessages(prev => [...prev,
        { id: Date.now(), type: 'user', text: message, timestamp: new Date() },
        { id: Date.now() + 1, type: 'bot', text: emergencyResponse.message, timestamp: new Date(), isEmergency: true }
      ]);
      setCurrentMessage('');
      return;
    }

    setIsLoading(true);
    setChatMessages(prev => [...prev,
      { id: Date.now(), type: 'user', text: message, timestamp: new Date() }
    ]);

    try {
      const response = await chatbotService.sendMessage(message);
      
      if (response.success) {
        setChatMessages(prev => [...prev,
          { id: Date.now(), type: 'bot', text: response.message, timestamp: new Date() }
        ]);
      } else {
        setChatMessages(prev => [...prev,
          { id: Date.now(), type: 'bot', text: response.message || 'I apologize, but I\'m having trouble processing your request right now.', timestamp: new Date() }
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev,
        { id: Date.now(), type: 'bot', text: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.', timestamp: new Date() }
      ]);
    } finally {
      setIsLoading(false);
      setCurrentMessage('');
    }
  };

  const addSymptom = () => {
    const value = symptomInput.trim();
    if (value && !selectedSymptoms.includes(value)) {
      setSelectedSymptoms([...selectedSymptoms, value]);
      setSymptomInput('');
      setChatMessages(prev => [...prev, 
        { id: Date.now(), type: 'user', text: `Added: ${value}`, timestamp: new Date() },
        { id: Date.now() + 1, type: 'bot', text: `Got it! I've noted ${value}. Any other symptoms?`, timestamp: new Date() }
      ]);
      toast.success(`Added "${value}"`);
    }
  };

  const addPredefinedSymptom = (symptom) => {
    if (!selectedSymptoms.includes(symptom.name)) {
      setSelectedSymptoms([...selectedSymptoms, symptom.name]);
      setChatMessages(prev => [...prev, 
        { id: Date.now(), type: 'user', text: `Selected: ${symptom.name}`, timestamp: new Date() },
        { id: Date.now() + 1, type: 'bot', text: `Noted ${symptom.name}. What else are you experiencing?`, timestamp: new Date() }
      ]);
      toast.success(`Added "${symptom.name}"`);
    }
  };

  const removeSymptom = (symptom) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    toast.info(`Removed "${symptom}"`);
  };

  const clearSymptoms = () => {
    setSelectedSymptoms([]);
    setShowResult(false);
    setDiagnosisResult('');
    setChatMessages(prev => [...prev, 
      { id: Date.now(), type: 'bot', text: 'All symptoms cleared. Let\'s start fresh!', timestamp: new Date() }
    ]);
    toast.info('Cleared all symptoms');
  };

  const getDiagnosis = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error('Please add at least one symptom.');
      return;
    }

    setIsLoading(true);
    setShowResult(false);
    
    setChatMessages(prev => [...prev, 
      { id: Date.now(), type: 'user', text: 'Please analyze my symptoms', timestamp: new Date() },
      { id: Date.now() + 1, type: 'bot', text: 'Analyzing your symptoms... This may take a moment.', timestamp: new Date() }
    ]);

    try {
      const userInfo = isAuthenticated ? {
        age: user?.age,
        gender: user?.gender,
        medicalHistory: user?.medicalHistory
      } : {};

      const response = await chatbotService.analyzeSymptoms(selectedSymptoms, userInfo);
      
      if (response.success) {
        setDiagnosisResult(response.analysis);
        setShowResult(true);
        
        setChatMessages(prev => [...prev, 
          { id: Date.now(), type: 'bot', text: 'Analysis complete! Here are my findings:', timestamp: new Date() }
        ]);
        
        setTimeout(() => {
          if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        toast.error(response.error || 'Failed to analyze symptoms');
        setChatMessages(prev => [...prev, 
          { id: Date.now(), type: 'bot', text: 'I apologize, but I\'m having trouble analyzing your symptoms right now. Please try again later or consult with a healthcare professional.', timestamp: new Date() }
        ]);
      }
    } catch (error) {
      console.error('Symptom analysis error:', error);
      toast.error('An error occurred while analyzing symptoms');
      setChatMessages(prev => [...prev, 
        { id: Date.now(), type: 'bot', text: 'I apologize, but I\'m having trouble analyzing your symptoms right now. Please try again later or consult with a healthcare professional.', timestamp: new Date() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockDiagnosis = (symptoms) => {
    const symptomsText = symptoms.join(', ');
    return `
      <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 24px; border: 1px solid #cbd5e1;">
        <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0;">
          <h3 style="color: #1e293b; font-size: 1.5rem; font-weight: bold; margin-bottom: 8px;">🔍 AI Analysis Complete</h3>
          <p style="color: #64748b;">Based on symptoms: <strong>${symptomsText}</strong></p>
        </div>
        
        <div style="display: grid; gap: 16px;">
          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #3b82f6;">
            <h4 style="color: #1e293b; font-size: 1.125rem; font-weight: 600; margin-bottom: 12px;">🎯 Possible Conditions</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 8px 0; color: #475569;"><strong>Common Cold</strong> - 75% match</li>
              <li style="padding: 8px 0; color: #475569;"><strong>Viral Infection</strong> - 60% match</li>
              <li style="padding: 8px 0; color: #475569;"><strong>Seasonal Allergies</strong> - 45% match</li>
            </ul>
          </div>
          
          <div style="background: white; border-radius: 12px; padding: 20px; border-left: 4px solid #10b981;">
            <h4 style="color: #1e293b; font-size: 1.125rem; font-weight: 600; margin-bottom: 12px;">💡 Recommendations</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 8px 0; color: #475569;">Get plenty of rest and stay hydrated</li>
              <li style="padding: 8px 0; color: #475569;">Consider over-the-counter pain relievers</li>
              <li style="padding: 8px 0; color: #475569;">Monitor symptoms for 24-48 hours</li>
              <li style="padding: 8px 0; color: #475569;">Consult a doctor if symptoms worsen</li>
            </ul>
          </div>
          
          <div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-radius: 12px; padding: 20px; border-left: 4px solid #f59e0b;">
            <h4 style="color: #1e293b; font-size: 1.125rem; font-weight: 600; margin-bottom: 12px;">⚠️ When to Seek Care</h4>
            <ul style="list-style: none; padding: 0; margin: 0;">
              <li style="padding: 8px 0; color: #475569;">Difficulty breathing or chest pain</li>
              <li style="padding: 8px 0; color: #475569;">High fever for more than 3 days</li>
              <li style="padding: 8px 0; color: #475569;">Severe headache with neck stiffness</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSymptom();
    }
  };

  return (
    <div className="chatbot-container" style={{ 
      background: '#f0f4ff', 
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      padding: '20px'
    }}>
      

      {/* Main Container */}
      <div className="main-container" style={{ 
        display: 'flex', 
        maxWidth: '1200px',
        margin: '0 auto',
        gap: '20px',
        flexWrap: 'wrap'
      }}>
        
        {/* Chat Interface */}
        <div className="chat-interface" style={{ 
          flex: '1',
          minWidth: '300px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          height: '700px'
        }}>
          
          {/* Chat Header */}
          <div className="chat-header-mobile" style={{
            background: '#6366f1',
            padding: '16px 24px',
            color: 'white',
            textAlign: 'center',
            borderRadius: '24px 24px 0 0',
            position: 'relative',
            overflow: 'hidden',
            border: 'none',
            boxShadow: 'none'
          }}>
            
            
            {/* Main content */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                marginBottom: '4px',
                position: 'relative',
                zIndex: 10
              }}>
                <div className="robot-icon" style={{ 
                  fontSize: '32px',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }}>
                  🤖
                </div>
                
                <h1 style={{ 
                  fontSize: '22px', 
                  fontWeight: '800', 
                  margin: '0',
                  color: 'white'
                }}>
                  AI Health Assistant
                </h1>
              </div>
              
              
              {/* Feature badges */}
              <div className="feature-badges" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginTop: '12px'
              }}>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  🧠 AI Powered
                </span>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  ⚡ Instant
                </span>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  🔒 Secure
                </span>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages" style={{ 
            padding: '24px',
            height: '500px',
            overflowY: 'auto',
            background: 'linear-gradient(to bottom, #f8fafc, #f1f5f9)',
            flex: '1'
          }}>
            {chatMessages.map(message => (
              <div key={message.id} style={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: message.type === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: message.type === 'user' 
                    ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                    : 'white',
                  color: message.type === 'user' ? 'white' : '#374151',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  border: message.type === 'bot' ? '1px solid #e5e7eb' : 'none'
                }}>
                  {message.text}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '20px 20px 20px 4px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '8px', height: '8px', borderRadius: '50%', 
                      background: '#6366f1', animation: 'bounce 1.4s infinite ease-in-out' 
                    }}></div>
                    <div style={{ 
                      width: '8px', height: '8px', borderRadius: '50%', 
                      background: '#6366f1', animation: 'bounce 1.4s infinite ease-in-out 0.2s' 
                    }}></div>
                    <div style={{ 
                      width: '8px', height: '8px', borderRadius: '50%', 
                      background: '#6366f1', animation: 'bounce 1.4s infinite ease-in-out 0.4s' 
                    }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{ 
            padding: '24px',
            borderTop: '1px solid #e5e7eb',
            background: 'white',
            borderRadius: '0 0 24px 24px'
          }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptom..."
                style={{ 
                  flex: '1',
                  padding: '14px 18px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '25px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  background: '#f9fafb'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#4f46e5';
                  e.target.style.background = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = '#f9fafb';
                }}
              />
              <button 
                onClick={addSymptom}
                style={{ 
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Symptoms Panel */}
        <div className="symptoms-panel" style={{ 
          width: '350px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
          height: '700px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#1f2937', 
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Quick Symptoms
          </h3>

          {/* Common Symptoms Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '8px', 
            marginBottom: '20px'
          }}>
            {commonSymptoms.map(symptom => (
              <button 
                key={symptom.name}
                onClick={() => addPredefinedSymptom(symptom)} 
                style={{ 
                  background: `${symptom.color}15`,
                  border: `1px solid ${symptom.color}40`,
                  padding: '12px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  color: symptom.color,
                  fontWeight: '500',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 4px 12px ${symptom.color}30`;
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '16px' }}>{symptom.icon}</span>
                <span>{symptom.name}</span>
              </button>
            ))}
          </div>

          {/* Selected Symptoms */}
          <div className="selected-symptoms" style={{ marginBottom: '20px', flex: '1', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#6b7280', 
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Selected ({selectedSymptoms.length})
            </h4>
            <div style={{ 
              flex: '1',
              minHeight: '200px',
              background: '#f9fafb',
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              alignContent: 'flex-start'
            }}>
              {selectedSymptoms.length === 0 ? (
                <p style={{ 
                  color: '#9ca3af', 
                  fontSize: '14px', 
                  margin: '0',
                  width: '100%',
                  textAlign: 'center',
                  paddingTop: '20px'
                }}>
                  No symptoms selected yet
                </p>
              ) : (
                selectedSymptoms.map(symptom => (
                  <span 
                    key={symptom}
                    style={{ 
                      background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {symptom}
                    <button 
                      onClick={() => removeSymptom(symptom)} 
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={getDiagnosis} 
              disabled={isLoading || selectedSymptoms.length === 0}
              style={{ 
                background: (isLoading || selectedSymptoms.length === 0) 
                  ? '#9ca3af' 
                  : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: (isLoading || selectedSymptoms.length === 0) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                if (!isLoading && selectedSymptoms.length > 0) {
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseOut={(e) => {
                if (!isLoading && selectedSymptoms.length > 0) {
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {isLoading ? '🔄 Analyzing...' : '🔍 Get AI Diagnosis'}
            </button>
            
            <button 
              onClick={clearSymptoms}
              style={{ 
                background: 'transparent',
                color: '#ef4444',
                border: '2px solid #ef4444',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#ef4444';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#ef4444';
              }}
            >
              🗑️ Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Diagnosis Result Modal */}
      {showResult && diagnosisResult && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowResult(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            <div 
              ref={resultRef}
              dangerouslySetInnerHTML={{ __html: diagnosisResult }}
            />
          </div>
        </div>
      )}

      <style>{`
        .chat-header-mobile h1::after {
          display: none !important;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes float {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          .chatbot-container {
            padding: 0 !important;
            margin: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            overflow-x: hidden !important;
          }
          .main-container {
            flex-direction: column !important;
            padding: 0 !important;
            gap: 0 !important;
            margin: 0 !important;
            max-width: none !important;
            width: 100% !important;
            height: 100vh !important;
          }
          .chat-interface {
            height: 100vh !important;
            width: 100% !important;
            min-width: unset !important;
            border-radius: 20px 20px 0 0 !important;
            margin: 0 !important;
          }
          .symptoms-panel {
            display: none !important;
          }
          .selected-symptoms {
            min-height: 100px !important;
            flex: none !important;
          }
          .chat-messages {
            height: calc(100vh - 200px) !important;
          }
          .chat-header-mobile {
            padding: 12px 16px !important;
            border-radius: 20px 20px 0 0 !important;
          }
          .chat-header-mobile h1 {
            font-size: 18px !important;
          }
          .chat-header-mobile .robot-icon {
            font-size: 24px !important;
            margin-bottom: 4px !important;
          }
          .chat-header-mobile .status-text {
            font-size: 10px !important;
          }
          .chat-header-mobile .feature-badges {
            margin-top: 4px !important;
            gap: 4px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
