# UnScrew - AI-Powered Interview Platform

An innovative interview preparation platform that leverages artificial intelligence to provide realistic voice-based interview simulations with real-time feedback and analysis.

## 🚀 Features

- **AI-Powered Voice Interviews**: Conduct realistic interviews with advanced speech recognition
- **Real-Time Speech Processing**: Leveraging Microsoft Cognitive Services for accurate voice recognition
- **Domain-Specific Questions**: Tailored interview questions based on job roles and experience levels
- **Modern UI/UX**: Sleek, futuristic interface with smooth animations and interactions
- **Toast Notifications**: Comprehensive feedback system for user actions
- **Responsive Design**: Fully responsive across all devices

## 🏗️ Architecture

### Frontend (Next.js 15)
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Custom components with Framer Motion animations
- **State Management**: React Hooks and Context API
- **Notifications**: React Toastify for user feedback

### Backend (FastAPI)
- **Framework**: FastAPI with Python
- **Database**: PostgreSQL with Alembic migrations
- **Authentication**: JWT-based authentication system
- **WebSocket**: Real-time communication for interview sessions
- **Speech Services**: Integration with Microsoft Cognitive Services

## 📋 Prerequisites

- Node.js 18+ 
- Python 3.9+
- Docker and Docker Compose
- PostgreSQL (if running locally)

## 🛠️ Installation

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd Unscrew
```

2. Set up environment variables:
```bash
# Backend environment
cp backend/.env.example backend/.env
# Frontend environment
cp frontend/.env.local.example frontend/.env.local
```

3. Run with Docker Compose:
```bash
docker-compose up --build
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Manual Setup

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up database:
```bash
alembic upgrade head
```

5. Run the backend:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

## 🔧 Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost/dbname
SECRET_KEY=your-secret-key
SPEECH_KEY=your-microsoft-speech-key
SPEECH_REGION=your-speech-region
```

### Frontend (.env.local)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
NEXT_PUBLIC_SPEECH_KEY=your-microsoft-speech-key
NEXT_PUBLIC_SPEECH_REGION=your-speech-region
```

## 📱 Usage

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Access your dashboard with your credentials
3. **Start Interview**: Select your domain and years of experience
4. **Voice Interaction**: Answer questions using your voice
5. **Real-time Feedback**: Get immediate responses and analysis

## 🎯 Key Components

### Frontend Components
- **Authentication System**: Login/signup with toast notifications
- **Interview Interface**: Real-time voice interaction with AI
- **Dashboard**: User profile and interview history
- **Navigation**: Responsive navbar with logout functionality

### Backend Features
- **User Management**: Secure authentication and authorization
- **Interview Engine**: AI-powered question generation and evaluation
- **WebSocket Handler**: Real-time communication for interview sessions
- **Speech Processing**: Integration with Microsoft Cognitive Services

## 🔗 API Endpoints

### Authentication
- `POST /user/auth/signup` - User registration
- `POST /user/auth/login` - User login
- `GET /me` - Get current user info

### Interview
- `POST /interview/start` - Start interview session
- `WebSocket /ws` - Real-time interview communication

## 🎨 Design System

The application features a dark, futuristic design with:
- **Color Palette**: Black, white, and neutral tones
- **Typography**: Geist font family with monospace accents
- **Animations**: Smooth transitions and micro-interactions
- **Components**: Custom UI components with consistent styling

## 🚀 Deployment

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend Deployment
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Common Issues

1. **Speech Recognition Not Working**
   - Check Microsoft Speech Services API keys
   - Ensure microphone permissions are granted

2. **WebSocket Connection Failed**
   - Verify backend is running on correct port
   - Check WebSocket URL in environment variables

3. **Database Connection Issues**
   - Ensure PostgreSQL is running
   - Check database URL in environment variables

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🔄 Version History

- **v1.0.0** - Initial release with basic interview functionality
- **v1.1.0** - Added toast notifications and improved UI
- **v1.2.0** - Enhanced speech recognition and WebSocket stability

---

Built with ❤️ for interview preparation and skill development.