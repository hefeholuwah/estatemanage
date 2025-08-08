# Quick Deployment Guide

## 🚀 Fastest Deployment Options

### 1. Railway (Recommended - Easiest)
**Time: 5 minutes**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret_key
   JWT_EXPIRE=30
   ACCESS_CODE_EXPIRE_TIME=1800000
   ```
6. Deploy! Your API will be live at `https://your-app.railway.app`

### 2. Render (Free Tier Available)
**Time: 10 minutes**

1. Go to [render.com](https://render.com)
2. Sign up and connect GitHub
3. Click "New" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: estate-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables in the dashboard
7. Deploy!

### 3. Heroku (Classic Choice)
**Time: 15 minutes**

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-estate-app`
4. Set environment variables:
   ```bash
   heroku config:set MONGO_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_secure_secret_key
   heroku config:set JWT_EXPIRE=30
   heroku config:set ACCESS_CODE_EXPIRE_TIME=1800000
   ```
5. Deploy: `git push heroku main`

### 4. DigitalOcean App Platform
**Time: 10 minutes**

1. Go to [digitalocean.com](https://digitalocean.com)
2. Create account and add payment method
3. Go to "Apps" → "Create App"
4. Connect GitHub repository
5. Configure:
   - **Source Directory**: backend
   - **Build Command**: `npm install`
   - **Run Command**: `npm start`
6. Add environment variables
7. Deploy!

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster
4. Create database user
5. Get connection string
6. Add to your environment variables

### Connection String Format
```
mongodb+srv://username:password@cluster.mongodb.net/estatemanage
```

## 🔧 Environment Variables Checklist

Make sure you have these in your deployment platform:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/estatemanage
JWT_SECRET=your_super_secure_random_string_here
JWT_EXPIRE=30
ACCESS_CODE_EXPIRE_TIME=1800000
PORT=5000
NODE_ENV=production
```

## 🧪 Test Your Deployment

### Health Check
```bash
curl https://your-app-domain.com/
# Should return: "EstateOne API is running..."
```

### Test Authentication
```bash
curl -X POST https://your-app-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 🔒 Security Checklist

- [ ] Use HTTPS (automatic on most platforms)
- [ ] Set strong JWT_SECRET
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable CORS for your frontend domain
- [ ] Set up monitoring/logging

## 📱 Connect to Frontend

Update your frontend API base URL to your deployed backend:

```javascript
// In your frontend code
const API_BASE_URL = 'https://your-app-domain.com/api';
```

## 🆘 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check if `package.json` is in the backend folder
   - Verify all dependencies are listed

2. **Database Connection Error**
   - Check MongoDB connection string
   - Ensure IP whitelist includes 0.0.0.0/0

3. **Environment Variables Not Working**
   - Restart the application after adding variables
   - Check variable names (case-sensitive)

4. **CORS Errors**
   - Add your frontend domain to CORS configuration
   - Check if using correct protocol (http vs https)

## 📊 Monitoring

### Railway
- Built-in logs and metrics
- Automatic restarts

### Render
- Built-in monitoring
- Automatic deployments

### Heroku
- Use Heroku logs: `heroku logs --tail`
- Add monitoring add-ons

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans |
|----------|-----------|------------|
| Railway | ✅ Yes | $5/month |
| Render | ✅ Yes | $7/month |
| Heroku | ❌ No | $7/month |
| DigitalOcean | ❌ No | $5/month |

## 🎯 Recommended Setup

**For Development/Testing:**
- Railway (free tier)

**For Production:**
- Railway or Render (paid plans)
- MongoDB Atlas (free tier for small apps)

## 📞 Support

- **Railway**: Discord community
- **Render**: Documentation and email support
- **Heroku**: Extensive documentation
- **DigitalOcean**: 24/7 support

---

**Quick Start Command:**
```bash
# Clone, setup, and deploy to Railway in one go
git clone <your-repo>
cd estatemanage/backend
# Add your .env file
# Deploy to Railway via web interface
``` 