# Mechanic Garage Management System

A comprehensive full-stack application for managing a mechanic garage with inventory tracking, job management, customer database, and detailed reporting.

## Security Status

✅ Production-ready with secure configuration
- RLS policies enabled on all tables
- Authentication required for all operations
- Secure environment variable handling
- Security headers configured
- No sensitive data in logs (production mode)
- See [SECURITY.md](./SECURITY.md) and [DEPLOYMENT.md](./DEPLOYMENT.md) for details

## Features

### 🔧 Inventory Management
- Add, edit, and remove parts
- Real-time stock tracking
- Low stock alerts and notifications
- Automatic parts deduction when jobs are completed
- Search and filter parts by category, supplier, or stock level

### 👥 Customer & Vehicle Management
- Customer database with contact information
- Vehicle registration and tracking
- Service history per customer/vehicle
- Job assignment and status tracking

### 📋 Job Management
- Create and manage repair jobs
- Track labor hours and costs
- Parts usage tracking with automatic inventory deduction
- Job status updates (Pending, In Progress, Completed)
- Generate job estimates and invoices

### 📊 Reporting & Analytics
- Revenue reports with date filtering
- Most used parts analysis
- Customer service history
- Inventory turnover reports
- Labor cost analysis

### 🔐 Authentication & Roles
- JWT-based authentication
- Role-based access control (Admin/Mechanic)
- Secure route protection
- User management

### ⚡ Real-time Features
- Live inventory updates across all connected clients
- Job status notifications
- Low stock alerts
- Real-time dashboard metrics

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **Icons**: Lucide React

## Setup Instructions

### 1. Supabase Setup

First, you'll need to set up Supabase:

1. Click the "Supabase" button in the settings (gear icon at the top of the preview)
2. This will configure your Supabase project and environment variables
3. The database schema will be created automatically when you first run the app

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Default Admin Account

After the database is set up, you can create an admin account by signing up through the login page. The first user will automatically be assigned the "admin" role.

## Database Schema

The app uses the following main tables:

- **profiles**: User profiles with role management
- **customers**: Customer information and contact details
- **vehicles**: Vehicle registration linked to customers
- **parts**: Inventory parts with stock tracking
- **jobs**: Repair jobs with status and cost tracking
- **job_parts**: Junction table linking jobs to parts used
- **stock_movements**: Audit trail for inventory changes

## Usage

### For Admins:
- Full access to all features
- User management and role assignment
- Complete inventory control
- Financial reports and analytics

### For Mechanics:
- View and update job status
- Access customer and vehicle information
- View inventory (read-only)
- Basic reporting features

## API Endpoints (Supabase Functions)

The app uses Supabase's built-in API with Row Level Security (RLS) policies to ensure data security and proper access control.

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Main application pages
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # Configuration files
```

### Adding New Features

1. Create new components in the `components` directory
2. Add new pages to the `pages` directory
3. Update routing in `App.tsx`
4. Add necessary database migrations if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own garage management needs.