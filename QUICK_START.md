# Quick Start Guide

## First Time Setup (5 minutes)

### 1. Get Supabase Credentials
1. Go to https://supabase.com and create a free account
2. Create a new project
3. Go to Settings > API
4. Copy your **Project URL** and **anon public key**

### 2. Configure Environment
```bash
# Copy the template
cp .env.example .env

# Edit .env and add your credentials:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install & Run
```bash
npm install
npm run dev
```

### 4. Create Account
1. Open http://localhost:5173
2. Click "Sign Up"
3. Enter email and password (min 6 characters)
4. Start using the app!

## Database Setup

The database schema is already created from the migrations in `supabase/migrations/`.

All tables have Row Level Security (RLS) enabled - users can only access their own data.

## Features Available

- ✅ **Inventory**: Manage parts with stock tracking
- ✅ **Customers**: Store customer information
- ✅ **Vehicles**: Track customer vehicles
- ✅ **Services**: Record service work with PDF export
- ✅ **Dashboard**: View analytics and low stock alerts

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

**Quick steps:**
1. Build: `npm run build`
2. Deploy `dist/` folder to your host
3. Set environment variables on hosting provider
4. Configure Supabase with your production URL

## Security

- All database access requires authentication
- Row Level Security protects user data
- Environment variables validated on startup
- Security headers configured
- No sensitive data in production logs

See [SECURITY.md](./SECURITY.md) for details.

## Getting Help

- Check [README.md](./README.md) for full documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide
- See [SECURITY.md](./SECURITY.md) for security guidelines

## Common Issues

### "Missing Supabase environment variables"
- Make sure you copied `.env.example` to `.env`
- Check that both variables are set correctly
- Verify URL starts with `https://`

### Authentication not working
- Check Supabase dashboard for errors
- Verify your credentials are correct
- Make sure Site URL is set in Supabase Auth settings

### Build fails
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Main application pages
├── hooks/         # Custom React hooks (auth, etc.)
├── lib/           # Configuration (Supabase)
├── utils/         # Utility functions
└── types/         # TypeScript types
```

## Next Steps

1. Explore the dashboard
2. Add your first customer
3. Create parts inventory
4. Record service work
5. Export service PDFs

Enjoy using the Garage Management System!
