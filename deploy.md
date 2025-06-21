# 🚀 Deployment Guide - Task Management API

## 📋 **Available Deployment Options**

| Option | Complexity | Database | Best For |
|--------|------------|----------|----------|
| **SQLite (Recommended)** | ⭐ Easy | Self-contained | Quick deployment, demos |
| **Heroku** | ⭐⭐ Medium | Heroku Postgres | Free hosting |
| **Vercel** | ⭐ Easy | Serverless | Static sites + API |
| **Railway** | ⭐⭐ Medium | Built-in DB | Modern deployment |
| **Docker** | ⭐⭐⭐ Advanced | Any | Production ready |

---

## 🎯 **Option 1: SQLite Deployment (Recommended for beginners)**

### **Local Testing:**
```bash
# Install SQLite dependency
npm install

# Start SQLite version
npm run start:sqlite
```

### **Deploy to Any Platform:**
- **No database server required**
- **Single file database**
- **Perfect for demos and small apps**

---

## 🎯 **Option 2: Heroku Deployment (Free)**

### **Step 1: Prepare for Heroku**
```bash
# Create Procfile
echo "web: npm start" > Procfile

# Install Heroku CLI
# Download from: https://devcenter.heroku.com/articles/heroku-cli
```

### **Step 2: Deploy**
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-task-api

# Add Heroku Postgres (free tier)
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### **Step 3: Setup Database**
```bash
# Get database URL
heroku config:get DATABASE_URL

# Run database setup
heroku run node -e "
const mysql = require('mysql2');
// Setup script here
"
```

---

## 🎯 **Option 3: Vercel Deployment (Serverless)**

### **Step 1: Create vercel.json**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server-sqlite.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server-sqlite.js"
    }
  ]
}
```

### **Step 2: Deploy**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Your API will be live at: https://your-app.vercel.app
```

---

## 🎯 **Option 4: Railway Deployment**

### **Step 1: Connect GitHub**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select your Task Management API repo

### **Step 2: Auto-deploy**
- Railway will automatically detect Node.js
- Uses `npm start` command
- Provides free PostgreSQL database

### **Step 3: Environment Variables**
```
DATABASE_URL=postgresql://... (automatically provided)
PORT=3000
```

---

## 🎯 **Option 5: Docker Deployment**

### **Step 1: Build Docker Image**
```bash
# Build image
docker build -t task-management-api .

# Run container
docker run -p 3002:3002 task-management-api
```

### **Step 2: Docker Compose (with MySQL)**
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3002:3002"
    environment:
      - DB_HOST=mysql
      - DB_USER=root
      - DB_PASSWORD=password
      - DB_NAME=tasks
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=tasks
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

### **Step 3: Run with Docker Compose**
```bash
docker-compose up -d
```

---

## 🎯 **Option 6: DigitalOcean App Platform**

### **Step 1: Create App**
1. Go to DigitalOcean App Platform
2. Connect GitHub repository
3. Choose your repo

### **Step 2: Configure**
```yaml
# .do/app.yaml
name: task-management-api
services:
- name: api
  source_dir: /
  github:
    repo: your-username/task-management-api
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: PORT
    value: "8080"
databases:
- name: task-db
  engine: PG
  version: "13"
```

---

## 🎯 **Option 7: AWS EC2 (Advanced)**

### **Step 1: Launch EC2 Instance**
```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
```

### **Step 2: Deploy Application**
```bash
# Clone repository
git clone https://github.com/your-username/task-management-api.git
cd task-management-api

# Install dependencies
npm install

# Start with PM2
pm2 start server-sqlite.js --name "task-api"
pm2 startup
pm2 save
```

### **Step 3: Setup Nginx (Optional)**
```bash
# Install Nginx
sudo apt install nginx

# Configure reverse proxy
sudo nano /etc/nginx/sites-available/task-api
```

---

## 🛠️ **Quick Start Commands**

### **Test SQLite Version Locally:**
```bash
npm install
npm run start:sqlite
# Visit: http://localhost:3002
```

### **Deploy to Heroku (Fastest):**
```bash
heroku create your-app-name
git push heroku main
```

### **Deploy to Vercel (Easiest):**
```bash
vercel
```

### **Deploy with Docker:**
```bash
docker build -t task-api .
docker run -p 3002:3002 task-api
```

---

## 🔧 **Environment Variables for Production**

```env
# For production deployment
NODE_ENV=production
PORT=3000

# Database (choose one)
# MySQL
DB_HOST=your-mysql-host
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=tasks

# OR PostgreSQL (for Heroku)
DATABASE_URL=postgresql://...

# OR SQLite (self-contained)
# No additional config needed
```

---

## 🎯 **Recommendation for Keploy Fellowship**

**For your submission, I recommend:**

1. **Demo Version:** Use SQLite (`npm run start:sqlite`)
   - No database setup required
   - Works anywhere
   - Perfect for demonstration

2. **Production Version:** Keep MySQL (`npm start`)
   - Shows full database integration
   - Enterprise-ready
   - Meets all requirements

**Best deployment for demo:** Vercel or Railway (free, fast, reliable)

---

## ✅ **Deployment Checklist**

- [ ] Test locally with `npm run start:sqlite`
- [ ] Choose deployment platform
- [ ] Set environment variables
- [ ] Deploy application
- [ ] Test all API endpoints
- [ ] Verify frontend works
- [ ] Share live URL

**🚀 Your Task Management API is ready for deployment!** 