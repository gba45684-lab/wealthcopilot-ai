# Deployment Guide - WealthCopilot AI

## 🚀 Production Deployment

### Prerequisites
- GitHub repository created and pushed
- Vercel account (free tier available)
- PostgreSQL database (Railway, Supabase, or AWS RDS)
- Clerk account configured
- OpenAI API key
- Twilio account with WhatsApp enabled

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] Seed data loaded (optional)
- [ ] SSL certificate configured
- [ ] CORS settings verified
- [ ] Authentication keys secured
- [ ] Rate limiting enabled
- [ ] Error logging configured

---

## 🌐 Vercel Deployment (Recommended)

### Step 1: Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Connect your GitHub account
4. Select `wealthcopilot-ai` repository

### Step 3: Configure Environment Variables

In Vercel dashboard, add these environment variables:

```
DATABASE_URL = postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_...
CLERK_SECRET_KEY = sk_live_...
OPENAI_API_KEY = sk-...
TWILIO_ACCOUNT_SID = AC...
TWILIO_AUTH_TOKEN = ...
TWILIO_WHATSAPP_NUMBER = whatsapp:+1234567890
NEXT_PUBLIC_APP_URL = https://yourdomain.vercel.app
NODE_ENV = production
```

### Step 4: Configure Build Settings

```
Framework: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-5 minutes)
3. Your app is now live!

---

## 🗄️ Database Setup

### Option A: Supabase (PostgreSQL)

1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings > Database > Connection Pooling
4. Add to `DATABASE_URL` environment variable

```bash
# Run migrations
npm run db:push

# Load seed data (optional)
npm run db:seed
```

### Option B: Railway

1. Go to https://railway.app
2. Create new PostgreSQL database
3. Copy connection string
4. Add to `DATABASE_URL`

### Option C: AWS RDS

1. Create RDS PostgreSQL instance
2. Configure security groups
3. Get connection string
4. Add to `DATABASE_URL`

---

## 🔑 API Keys & Secrets

### Clerk Authentication

1. Go to https://dashboard.clerk.com
2. Create new application
3. Get API keys from Developers > API Keys
4. Add to environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### OpenAI API

1. Go to https://platform.openai.com
2. Create API key
3. Set usage limits for cost control
4. Add `OPENAI_API_KEY` to environment variables

### Twilio WhatsApp

1. Go to https://www.twilio.com
2. Create WhatsApp-enabled phone number
3. Get Account SID and Auth Token
4. Add to environment variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_WHATSAPP_NUMBER`

---

## 🔒 Security Configuration

### Environment Variables
```env
# Never commit .env files
# Use Vercel's environment variable dashboard
# Rotate secrets regularly
```

### CORS Configuration
```javascript
// nextjs.config.js already configured
// Update NEXT_PUBLIC_APP_URL for your domain
```

### Rate Limiting
```typescript
// Add to API routes for production
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'),
});

const { success } = await ratelimit.limit('ip-identifier');
if (!success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
```

---

## 📊 Database Migrations

### Running Migrations in Production

```bash
# Generate migration
npm run db:migrate -- --name add_new_feature

# Push migrations
npm run db:push

# View database
npm run db:studio
```

### Vercel Deployment Hook

Create a post-deployment script in Vercel:

```bash
#!/bin/bash
npm run db:push --env-file=.env.production
```

---

## 📈 Performance Optimization

### Next.js Optimizations
```javascript
// next.config.js
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [/* ... */],
    formats: ['image/avif', 'image/webp'],
  },
};
```

### Database Connection Pooling
```env
# Use connection pooling for better performance
DATABASE_URL=postgresql://user:password@host:port/db?schema=public&pgbouncer=true
```

### CDN Configuration
- Vercel automatically serves static assets via CDN
- Images optimized with Next.js Image component
- API routes cached where possible

---

## 🔍 Monitoring & Logging

### Vercel Analytics
- Automatic performance monitoring
- Real-time error tracking
- Web Vitals metrics

### Error Tracking
```typescript
// Add Sentry for error tracking
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Database Monitoring
- Monitor query performance
- Check connection limits
- Review backup status

---

## 🚨 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
npm run build -- --no-cache

# Check for TypeScript errors
npm run type-check
```

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check connection pool
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
```

### API Routes Not Responding
- Check environment variables
- Verify Clerk keys are valid
- Check database connection
- Review server logs in Vercel dashboard

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

---

## 💰 Cost Estimation

| Service | Free Tier | Pro Tier |
|---------|-----------|----------|
| Vercel | $0 | $20+/month |
| Supabase | $0 | $25+/month |
| Clerk | $0 | $25+/month |
| OpenAI | $5 credit | $0.01-$0.03 per 1K tokens |
| Twilio | $0 | $0.0075 per message |
| **Total** | **$0** | **$75+/month** |

---

## 📝 Maintenance

### Regular Tasks
- [ ] Review error logs weekly
- [ ] Check API rate limits
- [ ] Monitor database size
- [ ] Backup database monthly
- [ ] Update dependencies monthly
- [ ] Review security vulnerabilities
- [ ] Test disaster recovery

### Updating Code
```bash
# Pull latest changes
git pull origin main

# Vercel auto-deploys on push
# Monitor deployment in Vercel dashboard
```

---

## 🎉 Post-Deployment

### Verification
1. Visit your app at https://yourdomain.vercel.app
2. Test authentication (Clerk)
3. Create test client
4. Test API endpoints
5. Verify email/SMS integrations

### Performance Testing
```bash
# Test site speed
# Use Vercel Analytics or Google PageSpeed Insights

# Test load
# Use k6 or JMeter for load testing
```

### User Onboarding
1. Create admin account
2. Set up first distributor
3. Load sample data
4. Train users

---

## 🔐 Production Security Checklist

- [ ] All secrets in environment variables
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Database backups configured
- [ ] Error logging configured
- [ ] Monitoring alerts set up
- [ ] SSL certificate valid
- [ ] CSRF protection enabled
- [ ] XSS protection configured

---

## 📞 Support

For deployment issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Review logs in Vercel dashboard
3. Check database connection status
4. Verify all environment variables are set

---

**🚀 Your WealthCopilot AI is now production-ready!**
