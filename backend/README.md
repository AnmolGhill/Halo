# HALO Backend API

Healthcare AI assistant backend with Firebase Authentication and Gemini AI integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Firebase project
- Google AI Studio API key (Gemini)

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Environment Setup:**
```bash
cp .env.example .env
```

3. **Configure Firebase:**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore
   - Download service account key
   - Update `.env` with your Firebase credentials

4. **Configure Gemini AI:**
   - Get API key from https://makersuite.google.com/app/apikey
   - Add `GEMINI_API_KEY` to `.env`

5. **Start server:**
```bash
npm run dev
```

## 📋 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /verify-email` - Send email verification
- `POST /reset-password` - Reset password
- `DELETE /account` - Delete user account

### Chatbot (`/api/chatbot`)
- `POST /chat` - Chat with HALO AI
- `POST /analyze-symptoms` - Analyze symptoms
- `GET /health-tips/:category` - Get health tips
- `GET /conversations` - Get user conversations
- `GET /conversations/:id` - Get specific conversation
- `DELETE /conversations/:id` - Delete conversation
- `GET /symptom-history` - Get symptom analysis history

## 🔧 Configuration

### Required Environment Variables
```env
# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Server
PORT=5000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:3000
```

## 🏗️ Project Structure
```
backend/
├── config/
│   ├── firebase.js      # Firebase configuration
│   └── gemini.js        # Gemini AI configuration
├── middleware/
│   └── auth.js          # Authentication middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   └── chatbot.js       # Chatbot routes
├── server.js            # Main server file
├── package.json
└── .env.example
```

## 🔐 Authentication Flow

1. **Registration:** User registers with email/password
2. **Firebase Auth:** Creates user in Firebase Authentication
3. **Firestore Profile:** Creates user profile in Firestore
4. **JWT Token:** Returns Firebase ID token for authentication

## 🤖 AI Features

### Healthcare Chat
- Powered by Gemini 1.5 Flash
- Healthcare-specific prompts
- Conversation history
- Safety disclaimers

### Symptom Analysis
- AI-powered symptom evaluation
- User health data integration
- Medical disclaimers
- Professional consultation recommendations

### Health Tips
- Category-based health advice
- Evidence-based recommendations
- Wellness guidance

## 🛡️ Security Features

- Firebase Authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Token verification

## 📊 Database Schema

### Users Collection
```javascript
{
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  role: 'user',
  emailVerified: boolean,
  profile: {
    avatar: string,
    bio: string,
    age: number,
    gender: string,
    preferences: object
  },
  healthData: {
    allergies: array,
    medications: array,
    conditions: array,
    emergencyContact: object
  },
  createdAt: timestamp,
  updatedAt: timestamp,
  lastLogin: timestamp
}
```

### Conversations Collection
```javascript
{
  id: string,
  userId: string,
  title: string,
  messages: [
    {
      id: string,
      user: string,
      ai: string,
      timestamp: timestamp
    }
  ],
  type: 'general' | 'symptom_analysis',
  createdAt: timestamp,
  updatedAt: timestamp,
  lastMessage: string
}
```

## 🚀 Deployment

1. **Production Environment:**
```bash
NODE_ENV=production
npm start
```

2. **Docker (Optional):**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Health check
curl http://localhost:5000/health
```

## 📝 API Usage Examples

### Register User
```javascript
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "securePassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890"
}
```

### Chat with AI
```javascript
POST /api/chatbot/chat
{
  "message": "I have a headache, what should I do?",
  "conversationId": "optional-conversation-id"
}
```

### Analyze Symptoms
```javascript
POST /api/chatbot/analyze-symptoms
{
  "symptoms": "headache, fever, fatigue",
  "userInfo": {
    "age": 30,
    "gender": "male"
  }
}
```

## 🔍 Monitoring

- Health endpoint: `/health`
- Request logging with Morgan
- Error tracking
- Performance monitoring

## 📞 Support

For issues and questions:
- Check the logs: `npm run dev`
- Verify environment variables
- Test Firebase connection
- Validate Gemini API key
