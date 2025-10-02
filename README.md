# Fitness Tracker

A full-stack fitness tracking application built with Django and React.

## Tech Stack

**Backend:**
- Django 4.2+ with Django REST Framework
- SQLite (development) / PostgreSQL (production)
- JWT Authentication
- CORS Headers

**Frontend:**
- React 19 with React Router
- Custom CSS (Tailwind-inspired utilities)
- Recharts for data visualization
- Axios for API calls

## Features

- User authentication (register/login with email or username)
- Workout tracking and management
- Exercise logging with sets, reps, and weight
- Dashboard with statistics and charts
- Personal records tracking

## Quick Start

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp env.example .env
python3 manage.py migrate
python3 manage.py createsuperuser  # Optional
python3 manage.py runserver
```

### Frontend Setup

```bash
cd frontend-new
npm install
echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
npm start
```

## Access

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000/api
- **Admin**: http://localhost:8000/admin

## Environment Variables

**Backend (.env):**
```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## Project Structure

```
Fitness-Tracker/
├── backend/           # Django API
│   ├── workouts/      # Main app
│   └── project/       # Settings
└── frontend-new/      # React app
    └── src/
        ├── components/
        ├── pages/
        ├── contexts/
        └── services/
```
