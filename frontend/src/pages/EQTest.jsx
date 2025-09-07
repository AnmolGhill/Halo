import React, { useState } from 'react';
import { toast } from 'react-toastify';

const EQTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      text: "I can easily identify my emotions as they occur.",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
      text: "I am aware of how my emotions affect others.",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
      text: "I can manage my emotions effectively under pressure.",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
      text: "I can easily read other people's emotions.",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    },
    {
      text: "I am good at motivating myself to achieve goals.",
      options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"]
    }
  ];

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers, answerIndex + 1];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const totalScore = newAnswers.reduce((sum, answer) => sum + answer, 0);
      const percentage = (totalScore / (questions.length * 5)) * 100;
      setScore(Math.round(percentage));
      setShowResult(true);
      toast.success('Assessment completed!');
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setScore(0);
  };

  const getFeedback = (score) => {
    if (score >= 80) return "Excellent emotional intelligence! You have strong self-awareness and social skills.";
    if (score >= 60) return "Good emotional intelligence. You have solid emotional skills with room for growth.";
    if (score >= 40) return "Average emotional intelligence. Consider developing your emotional awareness further.";
    return "Below average emotional intelligence. Focus on building emotional awareness and regulation skills.";
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        fontFamily: 'Poppins, sans-serif'
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '30px',
          fontSize: '2rem',
          fontWeight: '600'
        }}>
          Emotional Intelligence Assessment
        </h1>

        {!showResult ? (
          <>
            {/* Progress Bar */}
            <div style={{
              background: '#f0f0f0',
              borderRadius: '10px',
              height: '8px',
              marginBottom: '30px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                height: '100%',
                width: `${progressPercentage}%`,
                transition: 'width 0.3s ease',
                borderRadius: '10px'
              }}></div>
            </div>

            {/* Question */}
            <div>
              <h2 style={{
                color: '#333',
                marginBottom: '25px',
                fontSize: '1.3rem',
                lineHeight: '1.5'
              }}>
                {questions[currentQuestion].text}
              </h2>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    style={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '15px 20px',
                      borderRadius: '10px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontWeight: '500'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Results */
          <div style={{ textAlign: 'center' }}>
            <h2 style={{
              color: '#333',
              marginBottom: '30px',
              fontSize: '1.8rem'
            }}>
              Assessment Complete!
            </h2>
            
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '15px',
              padding: '30px',
              marginBottom: '30px',
              color: 'white'
            }}>
              <p style={{
                fontSize: '1.2rem',
                marginBottom: '15px'
              }}>
                Your EQ Score:
              </p>
              <div style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}>
                {score}%
              </div>
              <p style={{
                fontSize: '1rem',
                lineHeight: '1.6',
                opacity: '0.9'
              }}>
                {getFeedback(score)}
              </p>
            </div>
            
            <button
              onClick={restartQuiz}
              style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Take Test Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EQTest;
