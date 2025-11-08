# Deployment Guide - Vercel + Supabase

This guide will help you deploy the Fitness Tracker application to Vercel (frontend) and Supabase (database).

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
3. **GitHub Repository**: Push your code to GitHub

## Part 1: Supabase Setup (Database)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and database password
3. Wait for the database to be provisioned (usually 1-2 minutes)

### 1.2 Get Database Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Under **Connection string**, select **URI**
3. Copy the connection string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`)
4. Replace `[YOUR-PASSWORD]` with your actual database password

### 1.3 Run Migrations

1. Update your `.env` file with the Supabase DATABASE_URL:
   ```bash
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

2. Run migrations locally or on your backend server:
   ```bash
   cd backend
   python manage.py migrate
   ```

## Part 2: Backend Deployment

### Option A: Railway (Recommended for Django)

1. Go to [railway.app](https://railway.app) and sign up
2. Create a new project
3. Add a new service → **Deploy from GitHub repo**
4. Select your repository and the `backend` folder
5. Add environment variables:
   - `SECRET_KEY`: Generate a new Django secret key
   - `DEBUG`: `False`
   - `ALLOWED_HOSTS`: `your-railway-domain.railway.app,your-custom-domain.com`
   - `DATABASE_URL`: Your Supabase connection string
   - `CORS_ALLOWED_ORIGINS`: Your Vercel frontend URL
6. Railway will automatically detect Django and deploy
7. Note your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to [render.com](https://render.com) and sign up
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `cd backend && pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `cd backend && gunicorn project.wsgi:application`
   - **Root Directory**: `backend`
5. Add environment variables (same as Railway)
6. Deploy and note your backend URL

## Part 3: Frontend Deployment (Vercel)

### 3.1 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **Add New Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3.2 Add Environment Variables

In Vercel project settings → **Environment Variables**, add:

- `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-app.railway.app/api`)

### 3.3 Deploy

1. Click **Deploy**
2. Vercel will build and deploy your frontend
3. Note your frontend URL (e.g., `https://your-app.vercel.app`)

## Part 4: Update CORS Settings

### 4.1 Update Backend CORS

In your backend environment variables (Railway/Render), update:

```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-custom-domain.com
```

### 4.2 Update Frontend API URL

The frontend should automatically use `REACT_APP_API_URL` from Vercel environment variables.

## Part 5: Final Configuration

### 5.1 Update Supabase Settings (Optional)

If you want to use Supabase features beyond the database:

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon key**
3. Add to backend environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### 5.2 Test Your Deployment

1. Visit your Vercel frontend URL
2. Try registering a new user
3. Create a workout
4. Verify data appears in Supabase dashboard → **Table Editor**

## Environment Variables Summary

### Backend (Railway/Render)
```
SECRET_KEY=your-django-secret-key
DEBUG=False
ALLOWED_HOSTS=your-backend-domain.com
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend.railway.app/api
```

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check Supabase database is running
- Ensure IP allowlist in Supabase allows your backend server

### CORS Errors
- Verify CORS_ALLOWED_ORIGINS includes your Vercel URL
- Check backend logs for CORS errors
- Ensure credentials are allowed if using cookies

### Build Failures
- Check Vercel build logs
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

## Next Steps

1. Set up custom domains (optional)
2. Configure SSL certificates (automatic with Vercel/Railway)
3. Set up monitoring and error tracking
4. Configure CI/CD pipelines

## Support

For issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Railway: [railway.app/docs](https://railway.app/docs)

