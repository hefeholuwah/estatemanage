# Estate Management Backend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [API Endpoints](#api-endpoints)
4. [Database Models](#database-models)
5. [Authentication](#authentication)
6. [Local Development](#local-development)
7. [Production Deployment](#production-deployment)
8. [Environment Variables](#environment-variables)
9. [Security Considerations](#security-considerations)
10. [Monitoring & Logging](#monitoring--logging)

## Overview

The Estate Management Backend is a Node.js/Express.js REST API that provides endpoints for managing estate access, visitors, maintenance requests, emergency alerts, and notifications. The application uses MongoDB as the database and JWT for authentication.

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for cross-origin requests
- **QR Code Generation**: qrcode library

## Project Structure

```
backend/
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── seeder.js             # Database seeder
├── test-connection.js     # Database connection test
├── routes/               # API route handlers
│   ├── auth.js
│   ├── visitors.js
│   ├── logs.js
│   ├── emergency.js
│   ├── maintenance.js
│   └── notifications.js
├── controllers/          # Business logic
├── models/              # Database models
│   ├── User.js
│   ├── Visitor.js
│   ├── AccessLog.js
│   ├── EmergencyAlert.js
│   ├── MaintenanceRequest.js
│   └── Notification.js
├── middleware/           # Custom middleware
└── config/              # Configuration files
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-token` - Verify JWT token
- `POST /api/auth/change-password` - Change user password

### Visitors (`/api/visitors`)
- `POST /api/visitors/register` - Register new visitor
- `GET /api/visitors/:id` - Get visitor details
- `PUT /api/visitors/:id` - Update visitor information
- `DELETE /api/visitors/:id` - Remove visitor

### Access Logs (`/api/logs`)
- `GET /api/logs` - Get access logs
- `POST /api/logs` - Create access log entry
- `GET /api/logs/:id` - Get specific log entry

### Emergency Alerts (`/api/emergency`)
- `POST /api/emergency` - Create emergency alert
- `GET /api/emergency` - Get all emergency alerts
- `PUT /api/emergency/:id` - Update emergency alert
- `DELETE /api/emergency/:id` - Resolve emergency alert

### Maintenance Requests (`/api/maintenance`)
- `POST /api/maintenance` - Create maintenance request
- `GET /api/maintenance` - Get all maintenance requests
- `PUT /api/maintenance/:id` - Update maintenance request
- `DELETE /api/maintenance/:id` - Complete maintenance request

### Notifications (`/api/notifications`)
- `POST /api/notifications` - Create notification
- `GET /api/notifications` - Get all notifications
- `PUT /api/notifications/:id` - Mark notification as read
- `DELETE /api/notifications/:id` - Delete notification

## Database Models

### User Model
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `role` (String, enum: ['admin', 'resident', 'staff'])
- `name` (String, required)
- `phone` (String)
- `createdAt` (Date)

### Visitor Model
- `name` (String, required)
- `email` (String)
- `phone` (String, required)
- `purpose` (String, required)
- `hostId` (ObjectId, ref: 'User')
- `accessCode` (String, required)
- `expiresAt` (Date)
- `status` (String, enum: ['pending', 'approved', 'denied', 'expired'])

### AccessLog Model
- `visitorId` (ObjectId, ref: 'Visitor')
- `entryTime` (Date)
- `exitTime` (Date)
- `location` (String)

### EmergencyAlert Model
- `type` (String, required)
- `description` (String, required)
- `location` (String, required)
- `reportedBy` (ObjectId, ref: 'User')
- `status` (String, enum: ['active', 'resolved'])
- `priority` (String, enum: ['low', 'medium', 'high', 'critical'])

### MaintenanceRequest Model
- `title` (String, required)
- `description` (String, required)
- `category` (String, required)
- `priority` (String, enum: ['low', 'medium', 'high'])
- `reportedBy` (ObjectId, ref: 'User')
- `assignedTo` (ObjectId, ref: 'User')
- `status` (String, enum: ['pending', 'in-progress', 'completed'])

### Notification Model
- `title` (String, required)
- `message` (String, required)
- `type` (String, enum: ['info', 'warning', 'error', 'success'])
- `recipientId` (ObjectId, ref: 'User')
- `isRead` (Boolean, default: false)

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Users must include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### JWT Configuration
- **Secret**: `estate_management_secret_key` (should be changed in production)
- **Expiration**: 30 days
- **Algorithm**: HS256

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd estatemanage/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/estatemanage
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30
   ACCESS_CODE_EXPIRE_TIME=1800000
   PORT=5000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## Production Deployment

### Option 1: Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create your-estate-app
   ```

4. **Set environment variables**
   ```bash
   heroku config:set MONGO_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_secure_jwt_secret
   heroku config:set JWT_EXPIRE=30
   heroku config:set ACCESS_CODE_EXPIRE_TIME=1800000
   ```

5. **Deploy to Heroku**
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push heroku main
   ```

### Option 2: Railway Deployment

1. **Connect your GitHub repository to Railway**
   - Go to [railway.app](https://railway.app)
   - Create new project from GitHub repo

2. **Set environment variables in Railway dashboard**
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRE`
   - `ACCESS_CODE_EXPIRE_TIME`

3. **Deploy automatically**
   - Railway will automatically deploy on git push

### Option 3: DigitalOcean App Platform

1. **Create DigitalOcean account**
   - Sign up at [digitalocean.com](https://digitalocean.com)

2. **Create new app**
   - Connect your GitHub repository
   - Select Node.js as runtime

3. **Configure environment variables**
   - Add all required environment variables

4. **Deploy**
   - DigitalOcean will build and deploy automatically

### Option 4: AWS EC2 Deployment

1. **Launch EC2 instance**
   ```bash
   # Connect to your EC2 instance
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **Install Node.js and PM2**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Clone and setup application**
   ```bash
   git clone <your-repo-url>
   cd estatemanage/backend
   npm install
   ```

4. **Create ecosystem.config.js for PM2**
   ```javascript
   module.exports = {
     apps: [{
       name: 'estate-backend',
       script: 'server.js',
       instances: 'max',
       exec_mode: 'cluster',
       env: {
         NODE_ENV: 'production',
         PORT: 5000
       }
     }]
   };
   ```

5. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

6. **Setup Nginx reverse proxy**
   ```bash
   sudo apt-get install nginx
   ```

   Create `/etc/nginx/sites-available/estate-backend`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/estate-backend /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 5: Docker Deployment

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: .
       ports:
         - "5000:5000"
       environment:
         - MONGO_URI=mongodb://mongo:27017/estatemanage
         - JWT_SECRET=your_jwt_secret
         - JWT_EXPIRE=30
         - ACCESS_CODE_EXPIRE_TIME=1800000
       depends_on:
         - mongo
     
     mongo:
       image: mongo:latest
       ports:
         - "27017:27017"
       volumes:
         - mongo_data:/data/db
   
   volumes:
     mongo_data:
   ```

3. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

## Environment Variables

### Required Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time in days
- `ACCESS_CODE_EXPIRE_TIME` - Visitor access code expiration time in milliseconds

### Optional Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)

### Example .env file
```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/estatemanage

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=30
ACCESS_CODE_EXPIRE_TIME=1800000

# Server Configuration
PORT=5000
NODE_ENV=production
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique secrets for JWT
- Rotate secrets regularly

### 2. Database Security
- Use MongoDB Atlas with network access controls
- Enable authentication for database access
- Use connection string with username/password

### 3. API Security
- Implement rate limiting
- Add input validation
- Use HTTPS in production
- Implement CORS properly

### 4. JWT Security
- Use strong secret keys
- Set appropriate expiration times
- Implement token refresh mechanism
- Validate tokens on protected routes

### 5. Production Checklist
- [ ] Use HTTPS
- [ ] Set secure environment variables
- [ ] Enable CORS for specific domains
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Set up monitoring
- [ ] Configure error handling
- [ ] Use PM2 or similar process manager
- [ ] Set up automated backups

## Monitoring & Logging

### 1. Application Monitoring
```javascript
// Add to server.js
const morgan = require('morgan');
app.use(morgan('combined'));
```

### 2. Error Monitoring
```javascript
// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### 3. Health Check Endpoint
```javascript
// Add to server.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### 4. PM2 Monitoring
```bash
pm2 monit
pm2 logs
pm2 status
```

## API Testing

### Using Postman
1. Import the API collection
2. Set base URL to your deployed API
3. Test all endpoints with proper authentication

### Using curl
```bash
# Test health endpoint
curl https://your-api-domain.com/health

# Test authentication
curl -X POST https://your-api-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check connection string
   - Verify network access
   - Ensure database exists

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

3. **CORS Errors**
   - Configure CORS for your frontend domain
   - Check preflight requests

4. **Port Already in Use**
   - Change PORT environment variable
   - Kill existing process: `lsof -ti:5000 | xargs kill -9`

### Logs and Debugging
```bash
# View application logs
pm2 logs estate-backend

# Monitor in real-time
pm2 monit

# Restart application
pm2 restart estate-backend
```

## Performance Optimization

1. **Database Indexing**
   - Add indexes on frequently queried fields
   - Use compound indexes for complex queries

2. **Caching**
   - Implement Redis for session storage
   - Cache frequently accessed data

3. **Compression**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

4. **Load Balancing**
   - Use multiple PM2 instances
   - Implement horizontal scaling

## Backup Strategy

### Database Backups
```bash
# MongoDB backup
mongodump --uri="your_mongodb_connection_string" --out=./backup

# Restore backup
mongorestore --uri="your_mongodb_connection_string" ./backup
```

### Automated Backups
Set up cron jobs for regular backups:
```bash
# Add to crontab
0 2 * * * /usr/bin/mongodump --uri="your_connection_string" --out=/backup/$(date +\%Y\%m\%d)
```

---

This documentation provides a comprehensive guide for deploying and maintaining your Estate Management Backend in production. Always test thoroughly in a staging environment before deploying to production. 