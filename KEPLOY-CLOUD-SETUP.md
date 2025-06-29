# 🚀 Keploy Cloud Setup Guide for GitHub CI/CD

This guide shows you how to set up Keploy's AI-powered API testing with GitHub Actions using the official Keploy cloud platform.

## 📋 Prerequisites

- Task Management API running locally or deployed
- GitHub repository with your API code
- Access to [app.keploy.io](https://app.keploy.io)

## 🎯 Step 1: Create Keploy Account & Get Test Command

### 1.1 Sign Up for Keploy
1. Go to [app.keploy.io](https://app.keploy.io)
2. Create your account (free tier available)
3. Verify your email and log in

### 1.2 Create a New Application
1. Click on **"Create New App"** or similar option
2. Enter your application details:
   - **App Name**: `task-management-api`
   - **Description**: `REST API for task management with CRUD operations`
   - **Base URL**: `http://localhost:3000` (for local testing)

### 1.3 Get Your Test Suite Command
1. Navigate to **Test Suite** in the sidebar
2. Look for **"Run test suites natively"** option
3. **Copy the command** - it should look like:
   ```bash
   keploy test-suite --app=your-app-id-here --base-path http://localhost:3000 --cloud
   ```
4. **Save your App ID** - you'll need it for the GitHub Actions setup

## 🔑 Step 2: Set Up GitHub Secrets

### 2.1 Get Your Keploy API Key
1. In the Keploy dashboard, go to **Settings** or **API Keys**
2. Generate a new API key or copy your existing one
3. **Keep this secure** - you'll add it to GitHub secrets

### 2.2 Add Secret to GitHub Repository
1. Go to your GitHub repository
2. Click **Settings** → **Security** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add:
   - **Name**: `KEPLOY_API_KEY`
   - **Secret**: Your Keploy API key
5. Click **"Add secret"**

## ⚙️ Step 3: Update GitHub Actions Workflow

### 3.1 Update the Workflow File
In your `.github/workflows/keploy-tests.yml`, update the Keploy test step:

```yaml
- name: Run Keploy Test Suite
  run: |
    export KEPLOY_API_KEY=${{ secrets.KEPLOY_API_KEY }}
    keploy test-suite --app=YOUR_ACTUAL_APP_ID --base-path http://localhost:3000 --cloud
  continue-on-error: false
```

**Important**: Replace `YOUR_ACTUAL_APP_ID` with the actual App ID from Step 1.3.

### 3.2 Complete Workflow Example
Here's what your updated workflow should look like:

```yaml
name: Keploy AI-Powered API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: rootpassword
          MYSQL_DATABASE: task_management
          MYSQL_USER: testuser
          MYSQL_PASSWORD: testpass
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Setup Database
      run: |
        sudo apt-get install -y mysql-client
        until mysql -h127.0.0.1 -P3306 -uroot -prootpassword -e "SELECT 1"; do sleep 5; done
        mysql -h127.0.0.1 -P3306 -uroot -prootpassword task_management < database/setup.sql

    - name: Start Application
      run: |
        npm start &
        sleep 10
      env:
        NODE_ENV: test
        DB_HOST: localhost
        DB_PORT: 3306
        DB_USER: testuser
        DB_PASSWORD: testpass
        DB_NAME: task_management

    - name: Install Keploy CLI
      run: |
        curl --silent -L https://keploy.io/ent/install.sh | bash

    - name: Wait for API to be ready
      run: |
        timeout 60 bash -c 'until curl -f http://localhost:3000/health; do sleep 2; done'

    - name: Run Keploy AI Test Suite
      run: |
        export KEPLOY_API_KEY=${{ secrets.KEPLOY_API_KEY }}
        keploy test-suite --app=YOUR_APP_ID --base-path http://localhost:3000 --cloud
      continue-on-error: false
```

## 🧪 Step 4: Create Test Cases in Keploy Dashboard

### 4.1 Record Test Cases
1. In the Keploy dashboard, go to your app
2. Use the **Test Recorder** or **Import** feature
3. Create test cases for your key endpoints:
   - Health check: `GET /health`
   - Authentication: `POST /api/auth/register`, `POST /api/auth/login`
   - Tasks: `GET /api/tasks`, `POST /api/tasks`, `PUT /api/tasks/:id`

### 4.2 AI-Generated Test Cases
Keploy's AI will automatically:
- Generate edge cases
- Create validation tests
- Test error scenarios
- Optimize test coverage

## 🚀 Step 5: Test Your Setup

### 5.1 Local Testing
Before pushing to GitHub, test locally:

```bash
# Install Keploy CLI
npm run keploy:setup

# Set your API key
export KEPLOY_API_KEY=your-api-key-here

# Start your API
npm start

# Run test suite (in another terminal)
npm run keploy:test-suite
```

### 5.2 Push and Verify CI/CD
1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add Keploy cloud integration"
   git push origin main
   ```

2. Check GitHub Actions:
   - Go to **Actions** tab in your repository
   - Watch the workflow run
   - Verify tests pass successfully

## 📊 Step 6: View Test Results

### 6.1 GitHub Actions Console
You'll see real-time logs like:
```
🐰 Keploy: Running test suite	{"name": "Task Management API Tests"}
🐰 Keploy: Running test case	{"name": "Create Task"}
🐰 Keploy: step passed	{"step": "Create Task"}

+------------------------------------------+--------+-------+
| Test Case                                | Status | Runs  |
+------------------------------------------+--------+-------+
| Health Check                             | PASSED |     1 |
| User Registration                        | PASSED |     1 |
| Create Task                              | PASSED |     1 |
| Get All Tasks                            | PASSED |     1 |
+------------------------------------------+--------+-------+

Test suite execution summary
Total suites:     12
Passed suites:    12
Failed suites:     0
```

### 6.2 Keploy Dashboard
1. Go to [app.keploy.io](https://app.keploy.io)
2. View detailed test reports
3. Analyze test coverage
4. Review AI-generated insights

## 🔧 Step 7: Customize Your Test Suite

### 7.1 Add More Test Cases
In the Keploy dashboard:
- Create custom test scenarios
- Add boundary value tests
- Include security test cases
- Test different user roles

### 7.2 Configure Test Settings
- Set timeout values
- Configure retry policies
- Customize assertion rules
- Set up notifications

## 📈 Advanced Features

### 7.3 Test Environments
Configure different environments:
- **Development**: `http://localhost:3000`
- **Staging**: `https://staging-api.yourapp.com`
- **Production**: `https://api.yourapp.com`

### 7.4 Scheduled Testing
Set up periodic tests:
- Daily regression tests
- Performance monitoring
- Uptime checks

## 🐛 Troubleshooting

### Common Issues:

#### 1. API Key Not Working
```bash
# Verify your API key is set correctly
echo $KEPLOY_API_KEY

# Check GitHub secrets are properly configured
# Go to Settings → Secrets → Actions
```

#### 2. App ID Not Found
- Verify the App ID in the Keploy dashboard
- Ensure the App ID in the workflow matches exactly
- Check for typos in the command

#### 3. Connection Issues
- Ensure your API is running and accessible
- Check firewall settings
- Verify the base-path URL is correct

#### 4. Test Failures
- Review test logs in GitHub Actions
- Check the Keploy dashboard for detailed error messages
- Verify API responses match expected formats

## 📚 Additional Resources

- [Keploy Documentation](https://docs.keploy.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Keploy Community](https://github.com/keploy/keploy)
- [API Testing Best Practices](https://docs.keploy.io/concepts/what-is-keploy)

## ✅ Completion Checklist

- [ ] Created Keploy account at app.keploy.io
- [ ] Created application and got App ID
- [ ] Added KEPLOY_API_KEY to GitHub secrets
- [ ] Updated GitHub Actions workflow with correct App ID
- [ ] Created test cases in Keploy dashboard
- [ ] Successfully ran tests locally
- [ ] Verified CI/CD pipeline works
- [ ] Documented test results with screenshots

## 🎉 Success!

Your Task Management API now has **AI-powered testing** with:
- ✅ Automated test generation
- ✅ Intelligent edge case detection
- ✅ Real-time CI/CD integration
- ✅ Comprehensive test reporting
- ✅ Cloud-based test management

**Your API testing is now enterprise-ready!** 🚀 