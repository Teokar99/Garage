# Security Guidelines

## Environment Variables

### Setup
1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials from your Supabase dashboard
3. Never commit `.env` to version control

### Required Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL (must start with https://)
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Security Features

### Authentication
- Supabase email/password authentication
- Session management with automatic refresh
- Secure logout functionality

### Database Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Authentication-based policies for all operations

### API Security
- Environment variables validated on startup
- Secure HTTPS-only connections
- Supabase anonymous key used for client-side operations
- RLS policies enforce server-side security

### Client-Side Security
- React's built-in XSS protection
- No use of dangerouslySetInnerHTML
- Input validation on all forms
- Error messages don't expose system details

### Headers
Security headers configured in production:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

## Deployment Checklist

Before deploying to production:

1. [ ] Rotate all Supabase credentials
2. [ ] Ensure `.env` is in `.gitignore`
3. [ ] Review all RLS policies
4. [ ] Test authentication flows
5. [ ] Verify error handling doesn't expose sensitive data
6. [ ] Enable monitoring and logging
7. [ ] Set up rate limiting (via hosting provider)
8. [ ] Configure CORS in Supabase settings
9. [ ] Enable SSL/TLS certificates
10. [ ] Set up backup procedures

## Reporting Security Issues

If you discover a security vulnerability, please email security@example.com immediately.
Do not create public GitHub issues for security vulnerabilities.

## Additional Recommendations

### Production Environment
- Use environment-specific Supabase projects (dev, staging, prod)
- Enable Supabase's built-in rate limiting
- Set up monitoring alerts for suspicious activity
- Regularly rotate credentials
- Keep dependencies updated

### Supabase Dashboard
- Enable 2FA for your Supabase account
- Restrict IP addresses if possible
- Review audit logs regularly
- Set appropriate RLS policies

### Code Review
- Never log sensitive data
- Validate all user inputs
- Use prepared statements (Supabase handles this)
- Keep error messages generic to users
