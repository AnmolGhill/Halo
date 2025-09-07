from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
import os
import json
from typing import Optional

router = APIRouter()
security = HTTPBearer()

# Initialize Firebase Admin SDK
def initialize_firebase():
    if not firebase_admin._apps:
        # Create credentials from environment variables
        firebase_config = {
            "type": "service_account",
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "client_id": os.getenv("FIREBASE_CLIENT_ID"),
            "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
            "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
            "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
            "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL")
        }
        
        cred = credentials.Certificate(firebase_config)
        firebase_admin.initialize_app(cred)

# Initialize Firebase on module load
initialize_firebase()

# Pydantic models
class UserRegistration(BaseModel):
    email: EmailStr
    password: str
    firstName: str
    lastName: str
    phone: str

class UserLogin(BaseModel):
    idToken: str

class UserProfile(BaseModel):
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    medicalHistory: Optional[str] = None

# Dependency to verify Firebase token
async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        # Verify the ID token
        decoded_token = firebase_auth.verify_id_token(credentials.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )

@router.post("/register")
async def register_user(user_data: UserRegistration):
    """Register a new user with Firebase and store profile"""
    try:
        # Create user in Firebase Auth
        user = firebase_auth.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=f"{user_data.firstName} {user_data.lastName}"
        )
        
        # Store additional user profile in Firestore (you can implement this)
        # For now, we'll just return success
        
        return {
            "success": True,
            "message": "User registered successfully",
            "user": {
                "uid": user.uid,
                "email": user.email,
                "displayName": user.display_name
            }
        }
    except firebase_auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login")
async def login_user(login_data: UserLogin):
    """Verify Firebase ID token and return user info"""
    try:
        # Verify the ID token
        decoded_token = firebase_auth.verify_id_token(login_data.idToken)
        
        # Get user info from Firebase
        user = firebase_auth.get_user(decoded_token['uid'])
        
        return {
            "success": True,
            "user": {
                "uid": user.uid,
                "email": user.email,
                "displayName": user.display_name,
                "emailVerified": user.email_verified
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

@router.get("/profile")
async def get_user_profile(current_user: dict = Depends(verify_token)):
    """Get user profile information"""
    try:
        user = firebase_auth.get_user(current_user['uid'])
        
        # In a real app, you'd fetch additional profile data from Firestore
        return {
            "success": True,
            "user": {
                "uid": user.uid,
                "email": user.email,
                "displayName": user.display_name,
                "emailVerified": user.email_verified,
                "photoURL": getattr(user, 'photo_url', None),
                "phoneNumber": getattr(user, 'phone_number', None)
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get profile: {str(e)}"
        )

@router.put("/profile")
async def update_user_profile(
    profile_data: UserProfile,
    current_user: dict = Depends(verify_token)
):
    """Update user profile information"""
    try:
        # Update Firebase Auth profile
        update_data = {}
        if profile_data.firstName or profile_data.lastName:
            display_name = f"{profile_data.firstName or ''} {profile_data.lastName or ''}".strip()
            if display_name:
                update_data['display_name'] = display_name
        
        if update_data:
            firebase_auth.update_user(current_user['uid'], **update_data)
        
        # In a real app, you'd also update additional profile data in Firestore
        
        return {
            "success": True,
            "message": "Profile updated successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.delete("/account")
async def delete_user_account(current_user: dict = Depends(verify_token)):
    """Delete user account"""
    try:
        # Delete user from Firebase Auth
        firebase_auth.delete_user(current_user['uid'])
        
        # In a real app, you'd also delete user data from Firestore
        
        return {
            "success": True,
            "message": "Account deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete account: {str(e)}"
        )
