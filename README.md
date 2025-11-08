# Fitness Tracker

A full-stack fitness tracking application built with React (frontend) and Django REST Framework (backend), deployed on Vercel and Supabase.

## Features

- ✅ User authentication (JWT-based)
- ✅ Workout tracking and management
- ✅ Exercise logging
- ✅ Analytics and charts
- ✅ Modern, responsive UI
- ✅ Dark mode support

## Tech Stack

### Frontend
- React 19
- React Router
- Axios for API calls
- Recharts for data visualization
- Tailwind CSS (custom utility classes)

### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL (Supabase)
- JWT Authentication
- CORS enabled

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL (or Supabase account)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Fitness-Tracker.git
   cd Fitness-Tracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   cp env.example .env
   # Edit .env with your database credentials
   python manage.py migrate
   python manage.py runserver
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   # Edit .env.local with your API URL
   npm start
   ```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to Vercel and Supabase.

### Quick Deployment Steps

1. **Supabase**: Create project and get database URL
2. **Backend**: Deploy to Railway or Render with Supabase DATABASE_URL
3. **Frontend**: Deploy to Vercel with backend API URL

## Project Structure

```
Fitness-Tracker/
├── backend/           # Django backend
│   ├── project/      # Django project settings
│   ├── workouts/     # Main app with models, views, serializers
│   └── requirements.txt
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   └── services/
│   └── package.json
└── DEPLOYMENT.md     # Deployment guide
```

## Environment Variables

### Backend (.env)
- `SECRET_KEY`: Django secret key
- `DEBUG`: True/False
- `DATABASE_URL`: PostgreSQL connection string
- `CORS_ALLOWED_ORIGINS`: Frontend URLs
- `ALLOWED_HOSTS`: Backend domain

### Frontend (.env.local)
- `REACT_APP_API_URL`: Backend API URL

## API Endpoints

- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `GET /api/users/profile/` - Get user profile
- `GET /api/workouts/` - List workouts
- `POST /api/workouts/` - Create workout
- `GET /api/workouts/:id/` - Get workout details
- `PATCH /api/workouts/:id/` - Update workout
- `DELETE /api/workouts/:id/` - Delete workout
- `GET /api/dashboard/stats/` - Dashboard statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
