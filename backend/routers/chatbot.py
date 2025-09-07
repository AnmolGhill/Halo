from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import google.generativeai as genai
import os
from typing import Optional, List
from datetime import datetime
import json

router = APIRouter()
security = HTTPBearer()

# Configure Gemini AI
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize Gemini model
model = genai.GenerativeModel('gemini-pro')

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    conversationId: Optional[str] = None

class SymptomAnalysis(BaseModel):
    symptoms: List[str]
    userInfo: Optional[dict] = {}

class HealthTipsRequest(BaseModel):
    category: Optional[str] = "general"

# Dependency to verify Firebase token (optional for some endpoints)
async def verify_token_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))):
    if credentials:
        try:
            from firebase_admin import auth as firebase_auth
            decoded_token = firebase_auth.verify_id_token(credentials.credentials)
            return decoded_token
        except:
            return None
    return None

@router.post("/chat")
async def chat_with_ai(
    chat_data: ChatMessage,
    current_user: Optional[dict] = Depends(verify_token_optional)
):
    """Send message to AI chatbot"""
    try:
        # Create context-aware prompt
        system_prompt = """You are HALO, an AI healthcare assistant. You provide helpful, accurate health information while being empathetic and supportive. 

IMPORTANT SAFETY GUIDELINES:
- Always remind users that you're not a replacement for professional medical advice
- For emergencies, immediately direct users to call emergency services
- Be cautious about providing specific medical diagnoses
- Encourage users to consult healthcare professionals for serious concerns
- Provide general health information and wellness tips

Respond in a friendly, professional manner. Keep responses concise but informative."""

        # Check for emergency keywords
        emergency_keywords = [
            'chest pain', 'heart attack', 'stroke', 'difficulty breathing',
            'severe bleeding', 'unconscious', 'suicide', 'overdose',
            'severe allergic reaction', 'choking', 'severe burn'
        ]
        
        message_lower = chat_data.message.lower()
        if any(keyword in message_lower for keyword in emergency_keywords):
            return {
                "success": True,
                "message": "🚨 **EMERGENCY ALERT** 🚨\n\nI notice you may be describing a medical emergency. Please:\n\n**IMMEDIATE ACTIONS:**\n• Call emergency services immediately (911 in US, 112 in EU, or your local emergency number)\n• If someone is unconscious or not breathing, start CPR if trained\n• Stay calm and follow emergency operator instructions\n\n**DO NOT DELAY:** This AI cannot replace emergency medical care. Professional help is needed immediately for potentially life-threatening situations.",
                "conversationId": chat_data.conversationId,
                "timestamp": datetime.now().isoformat(),
                "isEmergency": True
            }

        # Create full prompt
        user_context = ""
        if current_user:
            user_context = f"\nUser is authenticated (ID: {current_user.get('uid', 'unknown')})"

        full_prompt = f"{system_prompt}\n{user_context}\n\nUser message: {chat_data.message}\n\nResponse:"

        # Generate response using Gemini
        response = model.generate_content(full_prompt)
        
        if response.text:
            return {
                "success": True,
                "message": response.text,
                "conversationId": chat_data.conversationId or f"conv_{datetime.now().timestamp()}",
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise Exception("No response generated")

    except Exception as e:
        print(f"Chat error: {str(e)}")
        return {
            "success": False,
            "error": "Failed to process message",
            "message": "I apologize, but I'm having trouble processing your request right now. Please try again later or consult with a healthcare professional for medical concerns."
        }

@router.post("/analyze-symptoms")
async def analyze_symptoms(
    analysis_data: SymptomAnalysis,
    current_user: Optional[dict] = Depends(verify_token_optional)
):
    """Analyze user symptoms using AI"""
    try:
        symptoms_text = ", ".join(analysis_data.symptoms)
        
        # Create detailed prompt for symptom analysis
        prompt = f"""As HALO, an AI healthcare assistant, analyze these symptoms: {symptoms_text}

User context: {json.dumps(analysis_data.userInfo, default=str)}

Provide a structured analysis including:
1. Possible conditions (emphasize these are possibilities, not diagnoses)
2. Recommended actions
3. When to seek medical care
4. General wellness tips

IMPORTANT: Always emphasize that this is not a medical diagnosis and professional consultation is recommended for proper evaluation.

Format your response in a clear, structured manner."""

        response = model.generate_content(prompt)
        
        if response.text:
            return {
                "success": True,
                "analysis": response.text,
                "symptoms": analysis_data.symptoms,
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise Exception("No analysis generated")

    except Exception as e:
        print(f"Symptom analysis error: {str(e)}")
        return {
            "success": False,
            "error": "Failed to analyze symptoms",
            "message": "Please consult with a healthcare professional for proper symptom evaluation."
        }

@router.post("/health-tips")
async def get_health_tips(tips_request: HealthTipsRequest):
    """Get health tips for specific category"""
    try:
        category = tips_request.category or "general"
        
        prompt = f"""As HALO, provide 5-7 practical health tips for the category: {category}

Make the tips:
- Actionable and specific
- Evidence-based
- Easy to understand
- Suitable for general audiences
- Focused on prevention and wellness

Format as a numbered list with brief explanations."""

        response = model.generate_content(prompt)
        
        if response.text:
            return {
                "success": True,
                "tips": response.text,
                "category": category,
                "timestamp": datetime.now().isoformat()
            }
        else:
            raise Exception("No tips generated")

    except Exception as e:
        print(f"Health tips error: {str(e)}")
        return {
            "success": False,
            "error": "Failed to get health tips"
        }

@router.get("/conversations")
async def get_conversations(current_user: dict = Depends(verify_token_optional)):
    """Get user's conversation history"""
    # In a real implementation, you'd fetch from a database
    # For now, return empty list
    return {
        "success": True,
        "conversations": []
    }

@router.get("/conversations/{conversation_id}")
async def get_conversation(
    conversation_id: str,
    current_user: dict = Depends(verify_token_optional)
):
    """Get specific conversation"""
    # In a real implementation, you'd fetch from a database
    return {
        "success": True,
        "conversation": {
            "id": conversation_id,
            "messages": []
        }
    }

@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    current_user: dict = Depends(verify_token_optional)
):
    """Delete a conversation"""
    # In a real implementation, you'd delete from a database
    return {
        "success": True,
        "message": "Conversation deleted successfully"
    }

@router.get("/symptom-history")
async def get_symptom_history(current_user: dict = Depends(verify_token_optional)):
    """Get user's symptom analysis history"""
    # In a real implementation, you'd fetch from a database
    return {
        "success": True,
        "history": []
    }
