import { chatbotAPI } from './api';

class ChatbotService {
  constructor() {
    this.currentConversationId = null;
    this.conversationHistory = [];
  }

  // Send message to chatbot
  async sendMessage(message, conversationId = null) {
    try {
      const response = await chatbotAPI.chat(message, conversationId || this.currentConversationId);
      
      if (response.success) {
        // Update current conversation ID
        if (response.conversationId) {
          this.currentConversationId = response.conversationId;
        }
        
        // Add to local history
        this.conversationHistory.push({
          user: message,
          ai: response.message,
          timestamp: response.timestamp
        });
      }
      
      return response;
    } catch (error) {
      console.error('Chat error:', error);
      return {
        success: false,
        error: 'Failed to send message',
        message: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.'
      };
    }
  }

  // Analyze symptoms
  async analyzeSymptoms(symptoms, userInfo = {}) {
    try {
      const response = await chatbotAPI.analyzeSymptoms(symptoms, userInfo);
      return response;
    } catch (error) {
      console.error('Symptom analysis error:', error);
      return {
        success: false,
        error: 'Failed to analyze symptoms',
        message: 'Please consult with a healthcare professional for proper symptom evaluation.'
      };
    }
  }

  // Get health tips
  async getHealthTips(category = 'general') {
    try {
      const response = await chatbotAPI.getHealthTips(category);
      return response;
    } catch (error) {
      console.error('Health tips error:', error);
      return {
        success: false,
        error: 'Failed to get health tips'
      };
    }
  }

  // Get conversation history
  async getConversations() {
    try {
      const response = await chatbotAPI.getConversations();
      return response;
    } catch (error) {
      console.error('Get conversations error:', error);
      return {
        success: false,
        error: 'Failed to fetch conversations'
      };
    }
  }

  // Get specific conversation
  async getConversation(conversationId) {
    try {
      const response = await chatbotAPI.getConversation(conversationId);
      
      if (response.success) {
        this.currentConversationId = conversationId;
        this.conversationHistory = response.conversation.messages || [];
      }
      
      return response;
    } catch (error) {
      console.error('Get conversation error:', error);
      return {
        success: false,
        error: 'Failed to fetch conversation'
      };
    }
  }

  // Delete conversation
  async deleteConversation(conversationId) {
    try {
      const response = await chatbotAPI.deleteConversation(conversationId);
      
      if (response.success && conversationId === this.currentConversationId) {
        this.clearCurrentConversation();
      }
      
      return response;
    } catch (error) {
      console.error('Delete conversation error:', error);
      return {
        success: false,
        error: 'Failed to delete conversation'
      };
    }
  }

  // Get symptom analysis history
  async getSymptomHistory() {
    try {
      const response = await chatbotAPI.getSymptomHistory();
      return response;
    } catch (error) {
      console.error('Get symptom history error:', error);
      return {
        success: false,
        error: 'Failed to fetch symptom history'
      };
    }
  }

  // Start new conversation
  startNewConversation() {
    this.currentConversationId = null;
    this.conversationHistory = [];
  }

  // Clear current conversation
  clearCurrentConversation() {
    this.currentConversationId = null;
    this.conversationHistory = [];
  }

  // Get current conversation ID
  getCurrentConversationId() {
    return this.currentConversationId;
  }

  // Get local conversation history
  getLocalHistory() {
    return this.conversationHistory;
  }

  // Health tips categories
  getHealthTipsCategories() {
    return [
      { id: 'general', name: 'General Wellness', icon: '🌟' },
      { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
      { id: 'exercise', name: 'Exercise & Fitness', icon: '💪' },
      { id: 'mental-health', name: 'Mental Health', icon: '🧠' },
      { id: 'sleep', name: 'Sleep & Rest', icon: '😴' },
      { id: 'preventive-care', name: 'Preventive Care', icon: '🛡️' },
      { id: 'heart-health', name: 'Heart Health', icon: '❤️' },
      { id: 'immune-system', name: 'Immune System', icon: '🦠' },
      { id: 'stress-management', name: 'Stress Management', icon: '🧘' },
      { id: 'hydration', name: 'Hydration', icon: '💧' }
    ];
  }

  // Common health questions
  getCommonQuestions() {
    return [
      "What are the symptoms of a common cold?",
      "How can I improve my sleep quality?",
      "What foods boost immune system?",
      "How much water should I drink daily?",
      "What are signs of dehydration?",
      "How to manage stress naturally?",
      "What exercises are good for beginners?",
      "How to maintain a healthy diet?",
      "When should I see a doctor?",
      "What are warning signs of heart problems?"
    ];
  }

  // Emergency keywords that should prompt immediate medical attention
  getEmergencyKeywords() {
    return [
      'chest pain', 'heart attack', 'stroke', 'difficulty breathing',
      'severe bleeding', 'unconscious', 'suicide', 'overdose',
      'severe allergic reaction', 'choking', 'severe burn',
      'broken bone', 'head injury', 'poisoning'
    ];
  }

  // Check if message contains emergency keywords
  containsEmergencyKeywords(message) {
    const emergencyKeywords = this.getEmergencyKeywords();
    const lowerMessage = message.toLowerCase();
    
    return emergencyKeywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
  }

  // Get emergency response
  getEmergencyResponse() {
    return {
      success: true,
      message: `🚨 **EMERGENCY ALERT** 🚨

I notice you may be describing a medical emergency. Please:

**IMMEDIATE ACTIONS:**
• Call emergency services immediately (911 in US, 112 in EU, or your local emergency number)
• If someone is unconscious or not breathing, start CPR if trained
• Stay calm and follow emergency operator instructions

**DO NOT DELAY:**
This AI cannot replace emergency medical care. Professional help is needed immediately for potentially life-threatening situations.

**After getting help:**
I'm here to provide general health information and support for non-emergency situations.

Stay safe! 🙏`,
      isEmergency: true,
      timestamp: new Date().toISOString()
    };
  }
}

// Create and export singleton instance
const chatbotService = new ChatbotService();
export default chatbotService;
