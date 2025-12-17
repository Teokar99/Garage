# Deployment Guide

## Prerequisites

1. Supabase account and project
2. Node.js 18+ and npm installed
3. Hosting provider account (Vercel, Netlify, or similar)

## Step 1: Prepare Environment

### 1.1 Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to Settings > API in your Supabase dashboard
3. Copy your:
   - Project URL
   - Anonymous (public) key

### 1.2 Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Supabase credentials:
   ```
   VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
   VITE_SUPABASE_URL=your_actual_project_url_here
   ```

## Step 2: Database Setup

Your Supabase project already has the database schema from the migrations in `supabase/migrations/`.

The database includes:
- User profiles with role management
- Customer management
- Vehicle tracking
- Parts inventory with stock management
- Service records with detailed line items
- Row Level Security (RLS) on all tables

All tables have RLS enabled and only authenticated users can access their data.

## Step 3: Build the Project

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

The build output will be in the `dist/` directory.

## Step 4: Deploy to Hosting Provider

### Option A: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Option B: Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy --prod`
3. Set environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Option C: Manual Deployment

1. Upload the `dist/` folder to your web server
2. Configure your web server to:
   - Serve `index.html` for all routes (SPA routing)
   - Set security headers (see SECURITY.md)
   - Enable HTTPS

## Step 5: Configure Supabase

### 5.1 Authentication Settings

1. Go to Authentication > Settings in Supabase dashboard
2. Configure:
   - Site URL: Your deployed app URL
   - Redirect URLs: Add your deployed URL
   - Disable email confirmation (or configure email provider)

### 5.2 CORS Settings

1. Go to Settings > API
2. Add your deployed URL to allowed origins

## Step 6: Post-Deployment

### 6.1 Verify Security

- [ ] All environment variables set correctly
- [ ] HTTPS enabled
- [ ] Authentication works
- [ ] RLS policies active
- [ ] No sensitive data in browser console

### 6.2 Create First User

1. Visit your deployed app
2. Click "Sign Up"
3. Create an account with email and password
4. You're ready to use the system!

## Environment Variables Reference

### Required Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key

### Security Notes
- Never commit `.env` files
- Use different Supabase projects for dev/staging/prod
- Rotate keys if they are ever exposed
- The anon key is safe to use client-side (protected by RLS)

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Authentication Not Working
- Check that Site URL matches your deployed URL
- Verify environment variables are set correctly
- Check Supabase dashboard for error logs

### Database Errors
- Verify RLS policies are active
- Check that user is authenticated
- Review Supabase logs for specific errors

### CORS Errors
- Add your domain to Supabase allowed origins
- Ensure URL format matches exactly (with/without trailing slash)

## Maintenance

### Regular Tasks
- Update dependencies monthly: `npm update`
- Review Supabase audit logs weekly
- Rotate credentials quarterly
- Backup database regularly

### Monitoring
- Set up uptime monitoring
- Configure error tracking (Sentry, etc.)
- Monitor Supabase usage and quotas
- Track authentication failures

## Support

For issues or questions:
1. Check SECURITY.md for security concerns
2. Review Supabase documentation
3. Check application logs
