# 🏫 School Management System

A comprehensive full-stack school management system built with **Next.js** frontend and **FastAPI** backend. This system provides efficient management of students, teachers, classes, and administrative tasks for educational institutions.

## 🚀 Features

- **Student Management**: Add, edit, and track student information
- **Teacher Management**: Manage teacher profiles and assignments
- **Class Management**: Organize classes, schedules, and enrollment
- **Grade Management**: Record and track student grades
- **Attendance Tracking**: Monitor student and teacher attendance
- **Authentication**: Secure login system for different user roles
- **Dashboard**: Interactive dashboards for different user types
- **Reports**: Generate various academic and administrative reports

## 🏗️ Project Structure

```
school-management-system/
├── frontend/                 # Next.js React Application
│   ├── pages/               # Next.js pages
│   ├── components/          # Reusable React components
│   ├── styles/              # CSS and styling files
│   ├── public/              # Static assets
│   ├── utils/               # Utility functions
│   └── package.json         # Frontend dependencies
│
├── backend/                 # FastAPI Python Application  
│   ├── app/                 # Main application directory
│   ├── models/              # Database models
│   ├── routers/             # API route handlers
│   ├── database/            # Database configuration
│   ├── auth/                # Authentication logic
│   ├── main.py              # FastAPI entry point
│   └── requirements.txt     # Python dependencies
│
├── README.md                # Project documentation
└── .gitignore              # Git ignore rules
```

## 🛠️ Technologies Used

### Frontend
- **Next.js** - React framework for production
- **React** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **Python** - Programming language
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL/SQLite** - Database
- **Pydantic** - Data validation using Python type annotations
- **JWT** - JSON Web Tokens for authentication

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16.0 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/school-management-system.git
cd school-management-system
```

### 2. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload
```

**Backend will be available at:** `http://localhost:8000`

**API Documentation:** `http://localhost:8000/docs` (Swagger UI)

### 3. Frontend Setup (Next.js)

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

**Frontend will be available at:** `http://localhost:3000`

## 🎯 Usage

1. **Access the Application**: Open your browser and go to `http://localhost:3000`
2. **Login**: Use the provided credentials or register a new account
3. **Dashboard**: Navigate through different sections using the sidebar menu
4. **Manage Data**: Add, edit, or delete students, teachers, and classes
5. **View Reports**: Generate and view various reports from the reports section

## 🔧 Development

### Recommended IDE Setup

**Backend Development:**
- **PyCharm** (Recommended)
  1. Open PyCharm
  2. File → Open → Select the `backend` folder
  3. Configure Python interpreter to use the virtual environment

**Frontend Development:**
- **VS Code** (Recommended)
  1. Open VS Code
  2. File → Open Folder → Select the `frontend` folder
  3. Install recommended extensions:
     - ES7+ React/Redux/React-Native snippets
     - Tailwind CSS IntelliSense
     - Prettier - Code formatter

### Environment Variables

Create `.env` files in both frontend and backend directories:

**Backend (.env):**
```env
DATABASE_URL=sqlite:///./school_management.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📱 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout

### Students
- `GET /students` - Get all students
- `POST /students` - Create new student
- `GET /students/{id}` - Get student by ID
- `PUT /students/{id}` - Update student
- `DELETE /students/{id}` - Delete student

### Teachers
- `GET /teachers` - Get all teachers
- `POST /teachers` - Create new teacher
- `GET /teachers/{id}` - Get teacher by ID
- `PUT /teachers/{id}` - Update teacher
- `DELETE /teachers/{id}` - Delete teacher

### Classes
- `GET /classes` - Get all classes
- `POST /classes` - Create new class
- `GET /classes/{id}` - Get class by ID
- `PUT /classes/{id}` - Update class
- `DELETE /classes/{id}` - Delete class

## 🧪 Testing

### Backend Testing
```bash
cd backend
pytest
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up a cloud database (PostgreSQL recommended)
2. Update environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Tharushi Umesha Mahipala - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to the Next.js and FastAPI communities
- Special thanks to all contributors
- Inspiration from various school management systems

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact: umemahee@gmail.com

---

⭐ If you found this project helpful, please give it a star on GitHub!
