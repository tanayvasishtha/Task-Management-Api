# Task Management API - Keploy Fellowship Session 2

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-blue.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-orange.svg)](https://mysql.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-lightblue.svg)](https://sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A professional REST API server built with Node.js, Express, and multiple database options (MySQL, SQLite, In-Memory) for managing tasks with full CRUD operations and a beautiful modern frontend interface.

## Features

### **Backend Capabilities**
- **6 RESTful API endpoints** with comprehensive CRUD operations
- **Multiple database options:** MySQL (production), SQLite (demo), In-Memory (testing)
- **Professional error handling** with structured JSON responses
- **Input validation** and sanitization
- **Connection pooling** for optimal performance
- **CORS enabled** for cross-origin requests

### **Modern Frontend**
- **Beautiful dark theme** inspired by Cursor/Perplexity design
- **Glass morphism UI** with backdrop blur effects
- **Real-time API interaction** with loading states
- **Responsive design** for all device sizes
- **Animated backgrounds** with flowing gradients
- **Form validation** and error handling

### **Deployment Ready**
- **Docker containerization** support
- **Multiple deployment options** (Heroku, Vercel, Railway, etc.)
- **Environment configuration** with `.env` support
- **Production-ready** error handling and logging

### **API Testing & CI/CD (Day 4 Implementation)**
- **OpenAPI 3.0 specification** for comprehensive API documentation
- **Keploy AI-powered testing** integration
- **GitHub Actions CI/CD pipeline** with automated testing
- **Chrome Extension testing** support for web API analysis
- **Automated test report generation** and artifact uploads

## API Endpoints

### **Core CRUD Operations**

| Method | Endpoint | Description | Parameters | Body |
|--------|----------|-------------|------------|------|
| `GET` | `/api/tasks` | Get all tasks | - | - |
| `GET` | `/api/tasks/:id` | Get specific task | `id` (number) | - |
| `GET` | `/api/tasks/status/:status` | Filter by status | `status` (pending/in-progress/completed) | - |
| `POST` | `/api/tasks` | Create new task | - | `{title, description?, status?}` |
| `PUT` | `/api/tasks/:id` | Update task | `id` (number) | `{title?, description?, status?}` |
| `DELETE` | `/api/tasks/:id` | Delete task | `id` (number) | - |

### **Additional Endpoints**
- `GET /health` - Health check endpoint
- `GET /` - Serves frontend interface

## Database Schema

```sql
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Quick Start

### **Method 1: SQLite (Recommended for Demo)**
```bash
# Clone the repository
git clone <your-repo-url>
cd task-management-api

# Install dependencies
npm install

# Start with SQLite (no database setup needed)
npm run start:sqlite
```

### **Method 2: MySQL (Production)**
```bash
# Install dependencies
npm install

# Setup MySQL database
mysql -u root -p < database/setup.sql

# Configure environment
cp env.example .env
# Edit .env with your MySQL credentials

# Start server
npm start
```

### **Method 3: In-Memory (Testing)**
```bash
# Install dependencies
npm install

# Start with in-memory storage
npm run start:memory
```

## Accessing the Application

Once started, your application is available at:

- **Frontend Interface:** `http://localhost:3030`
- **API Base URL:** `http://localhost:3030/api/tasks`
- **Health Check:** `http://localhost:3030/health`

## Project Structure

```
task-management-api/
├── routes/
│   ├── tasks.js              # MySQL routes
│   ├── tasks-sqlite.js       # SQLite routes
│   └── tasks-memory.js       # In-memory routes
├── database/
│   ├── connection.js         # MySQL connection
│   ├── sqlite-connection.js  # SQLite connection
│   └── setup.sql             # Database schema
├── frontend/
│   ├── index.html            # Modern UI interface
│   ├── style.css             # Beautiful styling
│   └── script.js             # Interactive functionality
├── server.js                 # MySQL server
├── server-sqlite.js          # SQLite server  
├── server-memory.js          # In-memory server
├── package.json              # Dependencies & scripts
├── Dockerfile                # Container configuration
├── deploy.md                 # Deployment guide
└── README.md                 # This file
```

## API Testing

### **Using curl**
```bash
# Create a task
curl -X POST http://localhost:3030/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Complete Project","description":"Finish the task management API","status":"in-progress"}'

# Get all tasks
curl http://localhost:3030/api/tasks

# Get specific task
curl http://localhost:3030/api/tasks/1

# Update task
curl -X PUT http://localhost:3030/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'

# Delete task
curl -X DELETE http://localhost:3030/api/tasks/1

# Filter by status
curl http://localhost:3030/api/tasks/status/pending
```

### **Sample Response Format**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "Complete Project",
    "description": "Finish the task management API",
    "status": "in-progress",
    "created_at": "2025-01-27T10:30:00.000Z",
    "updated_at": "2025-01-27T10:30:00.000Z"
  }
}
```

## Deployment Options

We provide **7 different deployment options** to suit your needs:

1. **SQLite Deployment** (Recommended for demos)
2. **Heroku** (Free hosting)
3. **Vercel** (Serverless)
4. **Railway** (Modern deployment)
5. **Docker** (Containerized)
6. **DigitalOcean App Platform**
7. **AWS EC2** (Advanced)

**See [deploy.md](deploy.md) for detailed deployment instructions**

## Available Scripts

```bash
# Development
npm start                 # Start MySQL server (port 3000)
npm run start:sqlite      # Start SQLite server (port 3030)
npm run start:memory      # Start in-memory server
npm run start:enhanced    # Start enhanced server

# Testing
npm test                  # Run Jest unit tests
npm run test:coverage     # Run tests with coverage
npm run test:integration  # Run integration tests

# API Testing with Keploy (Day 4)
npm run keploy:setup      # Install Keploy CLI
npm run keploy:test-suite # Run AI-powered test suite (cloud)
npm run test:api          # Execute API test script
npm run start:memory      # Start in-memory server (port 3001)

# Docker
npm run docker:build      # Build Docker image
npm run docker:run        # Run Docker container

# Testing
npm test                  # Run test suite (if implemented)
```

## Environment Configuration

Create a `.env` file for MySQL configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_management
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## Tech Stack

### **Backend**
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Databases:** MySQL 8.x / SQLite 3.x / In-Memory
- **Database Drivers:** mysql2, sqlite3
- **Middleware:** CORS, Express JSON parser
- **Environment:** dotenv

### **Frontend**
- **Languages:** HTML5, CSS3, Vanilla JavaScript
- **Design:** Glass Morphism, Dark Theme
- **Features:** Responsive, Animated, Interactive
- **Inspiration:** Cursor AI, Perplexity UI

### **DevOps**
- **Containerization:** Docker
- **Deployment:** Multi-platform support
- **Process Management:** PM2 ready
- **Monitoring:** Health check endpoint

## Assignment Completion

**All Keploy Fellowship Session 2 Requirements Met:**

- [x] **4+ API endpoints** (We have 6!)
- [x] **Database integration** (Multiple options: MySQL, SQLite, In-Memory)
- [x] **CRUD operations** (Create, Read, Update, Delete)
- [x] **API testing** (curl commands provided)
- [x] **GitHub repository** (This repository)
- [x] **Professional documentation** (This README)
- [x] **Bonus: Frontend interface** (Beautiful modern UI)
- [x] **Bonus: Multiple deployment options** (7 different ways)
- [x] **Bonus: Docker support** (Production-ready)

## Error Handling

### **HTTP Status Codes**
- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (Validation errors)
- `404` - Not Found (Resource doesn't exist)
- `500` - Internal Server Error

### **Error Response Format**
```json
{
  "success": false,
  "message": "Validation error",
  "error": "Title is required"
}
```

## Performance Features

- **Connection pooling** for database efficiency
- **Input validation** to prevent invalid data
- **Error boundaries** for graceful failure handling
- **Optimized queries** with proper indexing
- **CORS configuration** for security
- **Health monitoring** endpoint

## 🚀 Day 4: API Testing with AI & CI/CD Integration

This project now includes comprehensive API testing implementation using Keploy and CI/CD integration:

### **Files Added for Day 4:**
- `openapi.yaml` - Complete OpenAPI 3.0 specification
- `keploy.yml` - Keploy configuration file
- `.github/workflows/keploy-tests.yml` - GitHub Actions CI/CD pipeline
- `test-api.sh` - API testing script for Keploy
- `API-TESTING-GUIDE.md` - Comprehensive testing guide

### **Keploy Integration Features:**
- **AI-powered test generation** from API interactions
- **Automated test recording** and replay functionality  
- **CI/CD pipeline integration** with GitHub Actions
- **Comprehensive API coverage** including authentication and CRUD operations
- **Test report generation** with artifacts upload

### **Quick Start with Keploy Cloud:**

```bash
# 1. Create account at app.keploy.io and get your App ID

# 2. Install Keploy CLI
npm run keploy:setup

# 3. Set your API key
export KEPLOY_API_KEY=your-api-key-here

# 4. Start your API
npm start

# 5. Run AI-powered test suite
npm run keploy:test-suite
```

**📖 Complete Setup Guide**: [KEPLOY-CLOUD-SETUP.md](KEPLOY-CLOUD-SETUP.md)

### **CI/CD Pipeline:**
The GitHub Actions pipeline automatically:
1. ✅ Sets up Node.js and MySQL environment
2. ✅ Runs unit tests
3. ✅ Installs and configures Keploy
4. ✅ Records API test cases
5. ✅ Executes Keploy tests
6. ✅ Generates test reports
7. ✅ Uploads test artifacts

### **Chrome Extension Testing:**
Instructions provided for testing web APIs using Keploy Chrome Extension on:
- JSONPlaceholder demo site
- GitHub API interactions  
- Social media platforms

**For detailed instructions, see:** [API-TESTING-GUIDE.md](API-TESTING-GUIDE.md)

## UI Screenshots

The frontend features a beautiful modern design with:
- **Dark theme** with blue accents
- **Glass morphism** cards and effects
- **Animated backgrounds** with flowing patterns
- **Responsive design** for all devices
- **Real-time updates** with smooth animations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**KIIT Student** - Keploy Fellowship Session 2

---

## Congratulations!

You've successfully created a **professional-grade Task Management API** with:

- **Production-ready backend** with multiple database options
- **Beautiful modern frontend** with glass morphism design
- **Comprehensive documentation** and deployment guides
- **Professional error handling** and validation
- **Multiple deployment options** for any platform
- **Docker support** for containerized deployments

**Perfect for Keploy Fellowship Session 2!**

### **Ready for GitHub?**

Your project is now **production-ready** and **portfolio-worthy**! 

```bash
git add .
git commit -m "Complete Task Management API with modern UI"
git push origin main
```

**Star this repository if it helped you!** 
