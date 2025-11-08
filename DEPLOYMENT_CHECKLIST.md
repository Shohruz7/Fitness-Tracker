# Deployment Checklist

Use this checklist to ensure everything is set up correctly for deployment.

## Pre-Deployment

- [ ] All code is committed and pushed to GitHub
- [ ] All environment variables are documented in `.env.example` files
- [ ] Database migrations are up to date
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend runs successfully locally

## Supabase Setup

- [ ] Created Supabase project
- [ ] Obtained database connection string
- [ ] Tested database connection locally
- [ ] Ran migrations: `python manage.py migrate`
- [ ] Created superuser if needed: `python manage.py createsuperuser`

## Backend Deployment (Railway/Render)

- [ ] Created account on Railway or Render
- [ ] Connected GitHub repository
- [ ] Set root directory to `backend`
- [ ] Added environment variables:
  - [ ] `SECRET_KEY` (generate new one for production)
  - [ ] `DEBUG=False`
  - [ ] `ALLOWED_HOSTS=your-backend-domain.com`
  - [ ] `DATABASE_URL=postgresql://...` (from Supabase)
  - [ ] `CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app`
- [ ] Deployed and verified backend is running
- [ ] Tested API endpoints
- [ ] Noted backend URL

## Frontend Deployment (Vercel)

- [ ] Created Vercel account
- [ ] Connected GitHub repository
- [ ] Set root directory to `frontend`
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `build`
- [ ] Added environment variable:
  - [ ] `REACT_APP_API_URL=https://your-backend-domain.com/api`
- [ ] Deployed and verified frontend is accessible
- [ ] Tested frontend connects to backend

## Post-Deployment Testing

- [ ] Can access frontend URL
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Can create a workout
- [ ] Can view workouts list
- [ ] Can edit a workout
- [ ] Can delete a workout
- [ ] Can view analytics/charts
- [ ] Data persists in Supabase database
- [ ] No CORS errors in browser console
- [ ] No 404 errors for routes

## Security Checklist

- [ ] `DEBUG=False` in production
- [ ] `SECRET_KEY` is strong and unique
- [ ] CORS only allows frontend domain
- [ ] Database credentials are secure
- [ ] Environment variables are not in code
- [ ] HTTPS is enabled (automatic with Vercel/Railway)

## Monitoring

- [ ] Set up error tracking (optional)
- [ ] Set up analytics (optional)
- [ ] Monitor backend logs
- [ ] Monitor database usage

## Custom Domain (Optional)

- [ ] Added custom domain to Vercel
- [ ] Updated `CORS_ALLOWED_ORIGINS` with custom domain
- [ ] SSL certificate is active
- [ ] DNS records are configured

## Troubleshooting

If something doesn't work:

1. Check backend logs (Railway/Render dashboard)
2. Check frontend build logs (Vercel dashboard)
3. Check browser console for errors
4. Verify environment variables are set correctly
5. Verify database connection string is correct
6. Check CORS settings match frontend URL
7. Verify API endpoints are accessible

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Railway Docs: https://railway.app/docs
- Render Docs: https://render.com/docs

