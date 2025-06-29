# 🚀 Day 4: API Testing with AI & CI/CD Integration Guide

This guide covers the implementation of Day 4 tasks for API Testing using Keploy and Chrome Extension testing.

## 📋 Task 1: API Testing with AI [Mandatory]

### ✅ Step 1: OpenAPI Schema Created

We've created a comprehensive OpenAPI 3.0 schema (`openapi.yaml`) that documents all API endpoints:

- **Health Endpoint**: `/health`
- **Authentication Endpoints**: 
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/profile`
  - `POST /api/auth/verify`
  - `GET /api/auth/demo-credentials`
- **Task Management Endpoints**:
  - `GET /api/tasks` - Get all tasks
  - `POST /api/tasks` - Create new task
  - `GET /api/tasks/{id}` - Get specific task
  - `PUT /api/tasks/{id}` - Update task
  - `DELETE /api/tasks/{id}` - Delete task
  - `GET /api/tasks/status/{status}` - Filter by status

### ✅ Step 2: Keploy Configuration

The project now includes:
- `keploy.yml` - Keploy configuration file
- `test-api.sh` - API testing script for Keploy
- `.github/workflows/keploy-tests.yml` - CI/CD pipeline

### 🔧 Keploy Cloud Integration (Recommended)

#### Prerequisites
1. Create account at [app.keploy.io](https://app.keploy.io)
2. Install Keploy CLI:
```bash
# Official Keploy Installation
curl --silent -L https://keploy.io/ent/install.sh | bash
```

3. Start your application:
```bash
npm start
```

#### Cloud Setup
1. **Get App ID from Keploy Dashboard**:
   - Go to [app.keploy.io](https://app.keploy.io)
   - Create new app: `task-management-api`
   - Copy your App ID from Test Suite section

2. **Set API Key**:
   ```bash
   export KEPLOY_API_KEY=your-api-key-here
   ```

3. **Run AI-Powered Test Suite**:
   ```bash
   npm run keploy:test-suite
   ```
   
   Or directly:
   ```bash
   keploy test-suite --app=your-app-id --base-path http://localhost:3000 --cloud
   ```

#### Local Testing (Alternative)
For local testing without cloud:
```bash
# Legacy local approach (still works)
keploy record --config-path=keploy.yml

# In another terminal, run tests
bash test-api.sh

# Run recorded tests
keploy test --config-path=keploy.yml --delay=5s
```

### 🚀 CI/CD Integration with GitHub Actions

The pipeline automatically:
1. Sets up Node.js and MySQL environment
2. Installs dependencies and runs unit tests
3. Starts the application
4. Installs Keploy CLI via official installer
5. Runs AI-powered test suite from Keploy Cloud
6. Generates comprehensive test reports
7. Displays results in GitHub Actions summary

#### Pipeline Features:
- ✅ **AI-Powered Testing**: Intelligent test generation and execution
- ✅ **Cloud Integration**: Tests managed from Keploy dashboard
- ✅ **Automated Testing**: Runs on every push/PR
- ✅ **Database Setup**: MySQL integration
- ✅ **Real-time Reports**: Live test results in GitHub Actions
- ✅ **Deployment**: Auto-deploy on successful tests (main branch)

#### Required Setup:
1. **Create Keploy account** at [app.keploy.io](https://app.keploy.io)
2. **Get App ID** from your Test Suite dashboard
3. **Add GitHub Secret**: `KEPLOY_API_KEY` in repository settings
4. **Update workflow**: Replace `your-app-id-here` with actual App ID

**📖 Detailed Setup Guide**: See [KEPLOY-CLOUD-SETUP.md](KEPLOY-CLOUD-SETUP.md)

### 📊 API Testing Coverage

Our Keploy tests cover:

#### Authentication Flow
- ✅ User registration with validation
- ✅ User login and token generation
- ✅ Token verification
- ✅ Profile access with authentication

#### Task Management
- ✅ Create, read, update, delete operations
- ✅ Status filtering (pending, in-progress, completed)
- ✅ Input validation and error handling
- ✅ Database persistence

#### Error Scenarios
- ✅ Invalid input handling
- ✅ Non-existent resource responses
- ✅ Authentication failures
- ✅ Validation errors

### 🧪 Manual Testing Commands

You can test individual endpoints using these curl commands:

```bash
# Health Check
curl -X GET http://localhost:3000/health

# Authentication
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","email":"test@example.com"}'

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Task Management
curl -X GET http://localhost:3000/api/tasks

curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Sample Task","description":"Test task","status":"pending"}'

curl -X GET http://localhost:3000/api/tasks/status/pending
```

## 📋 Task 2: Chrome Extension API Testing [Mandatory]

### 🌐 Using Keploy Chrome Extension

#### Installation
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "Keploy" or use [this direct link](https://chrome.google.com/webstore/detail/keploy/...)
3. Click "Add to Chrome"

#### Testing Websites with APIs

We'll test these websites that make API calls:

#### Website 1: JSONPlaceholder Demo (https://jsonplaceholder.typicode.com/)
This is a fake REST API for testing and prototyping.

**Testing Steps:**
1. Open https://jsonplaceholder.typicode.com/
2. Activate Keploy Chrome Extension
3. Navigate to different sections (posts, comments, users)
4. Record API calls made by the website
5. Generate test cases

**Expected API Calls:**
- `GET /posts` - Fetch all posts
- `GET /posts/1` - Fetch specific post
- `GET /users` - Fetch users
- `GET /comments` - Fetch comments

#### Website 2: GitHub (https://github.com)
GitHub makes extensive API calls for repository data, user profiles, etc.

**Testing Steps:**
1. Log into GitHub
2. Enable Keploy extension
3. Browse repositories, view profiles, check issues
4. Record API interactions
5. Generate automated tests

**Expected API Calls:**
- User profile APIs
- Repository listing APIs
- Issues and PR APIs
- Search APIs

#### Website 3: Social Media Platform (Twitter/LinkedIn)
Test dynamic content loading and real-time updates.

**Testing Steps:**
1. Visit the platform
2. Start Keploy recording
3. Scroll through feeds, search, view profiles
4. Capture API calls for content loading
5. Generate comprehensive test suite

### 📸 Documentation Requirements

For submission, capture screenshots showing:

1. **Keploy Chrome Extension Interface** - Recording in progress
2. **API Calls Captured** - List of recorded API endpoints
3. **Test Generation** - Automated test cases created
4. **Test Results** - Execution results and coverage

### 🎯 Success Criteria

#### Task 1 Success Indicators:
- ✅ OpenAPI schema accurately documents all endpoints
- ✅ Keploy tests cover all major API flows
- ✅ CI/CD pipeline runs without errors
- ✅ Test reports are generated and accessible
- ✅ Pipeline integrates with GitHub Actions

#### Task 2 Success Indicators:
- ✅ Successfully tested at least 2 different websites
- ✅ Captured meaningful API interactions
- ✅ Generated automated test cases
- ✅ Documented process with screenshots

## 🔗 Useful Links

- [Keploy Documentation](https://docs.keploy.io/)
- [Keploy CI/CD Guide](https://docs.keploy.io/server/guide/ci-cd-integration)
- [OpenAPI Specification](https://swagger.io/specification/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 📞 Support

If you encounter issues:
1. Check the [Keploy GitHub Issues](https://github.com/keploy/keploy/issues)
2. Review CI/CD logs in GitHub Actions
3. Verify API endpoints are working manually
4. Ensure database connections are properly configured

---

## 🎉 Completion Checklist

- [ ] OpenAPI schema created and documented
- [ ] Keploy configuration set up
- [ ] CI/CD pipeline implemented with GitHub Actions
- [ ] Pipeline runs successfully without errors
- [ ] Test reports generated and accessible
- [ ] Chrome extension testing completed on 2+ websites
- [ ] Screenshots captured and documented
- [ ] GitHub repository updated with all configurations

**Submit**: Screenshots of Keploy test reports and link to GitHub repository with CI/CD configuration. 