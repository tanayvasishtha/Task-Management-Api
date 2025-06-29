# 📱 Task 2: Chrome Extension API Testing Guide

This guide provides step-by-step instructions for completing Task 2 using the Keploy Chrome Extension to test API calls on different websites.

## 🎯 Task Objective

Test at least **2 different websites** that make API calls using the Keploy Chrome Extension and document the process with screenshots.

## 📥 Step 1: Install Keploy Chrome Extension

1. **Open Chrome Web Store**
   - Go to [Chrome Web Store](https://chrome.google.com/webstore)
   - Search for "Keploy"

2. **Install Extension**
   - Click "Add to Chrome"
   - Confirm installation

3. **Verify Installation**
   - Look for Keploy icon in your Chrome toolbar
   - Pin the extension for easy access

## 🌐 Step 2: Test Website #1 - JSONPlaceholder

### About JSONPlaceholder
- **URL**: https://jsonplaceholder.typicode.com/
- **Description**: Free fake REST API for testing and prototyping
- **Why choose this**: Clear API structure, well-documented endpoints

### Testing Steps:

1. **Open the Website**
   ```
   Navigate to: https://jsonplaceholder.typicode.com/
   ```

2. **Activate Keploy Extension**
   - Click the Keploy icon in Chrome toolbar
   - Start recording API calls

3. **Interact with the Website**
   - Click on "posts" section
   - View individual posts
   - Navigate to "comments"
   - Check "users" section
   - Try "todos" and "albums"

4. **Expected API Calls to Capture:**
   ```
   GET /posts
   GET /posts/1
   GET /posts/1/comments
   GET /comments?postId=1
   GET /users
   GET /users/1
   GET /todos
   GET /albums
   ```

5. **Stop Recording**
   - Stop the Keploy extension recording
   - Review captured API calls

### 📸 Screenshots to Capture:
- [ ] Keploy extension interface showing recording status
- [ ] List of captured API endpoints
- [ ] Sample request/response details
- [ ] Generated test cases

## 🌐 Step 3: Test Website #2 - GitHub

### About GitHub
- **URL**: https://github.com
- **Description**: Code hosting platform with extensive API usage
- **Why choose this**: Real-world API interactions, dynamic content

### Testing Steps:

1. **Login to GitHub**
   - Go to https://github.com
   - Sign in to your account

2. **Start Keploy Recording**
   - Activate the Chrome extension
   - Begin monitoring API calls

3. **Interact with GitHub Features**
   - Browse your repositories
   - View a repository's issues
   - Check pull requests
   - Search for repositories
   - View user profiles
   - Look at repository insights/stats

4. **Expected API Calls to Capture:**
   ```
   GET /user
   GET /user/repos
   GET /repos/{owner}/{repo}
   GET /repos/{owner}/{repo}/issues
   GET /repos/{owner}/{repo}/pulls
   GET /search/repositories?q={query}
   GET /users/{username}
   GET /repos/{owner}/{repo}/stats/contributors
   ```

5. **Stop Recording**
   - End the recording session
   - Review all captured interactions

### 📸 Screenshots to Capture:
- [ ] Extension showing active recording
- [ ] GitHub API calls list
- [ ] Detailed API request headers
- [ ] Response data structure
- [ ] Test generation results

## 🌐 Step 4: Test Website #3 - News/Social Platform (Optional but Recommended)

### Suggested Options:

#### Option A: Hacker News
- **URL**: https://news.ycombinator.com/
- **API Calls**: Story listings, comments, user profiles

#### Option B: Reddit
- **URL**: https://reddit.com
- **API Calls**: Post feeds, comments, user data

#### Option C: Twitter/X
- **URL**: https://twitter.com
- **API Calls**: Timeline, tweets, user interactions

### Testing Process:
1. Start Keploy recording
2. Browse content, interact with posts
3. View comments, user profiles
4. Search for content
5. Capture various API interactions

## 📋 Documentation Requirements

For each website tested, document the following:

### 1. Extension Interface Screenshots
- [ ] Recording in progress indicator
- [ ] Settings/configuration panel
- [ ] API call counter/status

### 2. API Calls Captured
- [ ] Complete list of endpoints
- [ ] HTTP methods used (GET, POST, PUT, DELETE)
- [ ] Request headers and parameters
- [ ] Response status codes

### 3. Request/Response Details
- [ ] Sample request structure
- [ ] Response data format (JSON, XML, etc.)
- [ ] Authentication methods used
- [ ] Query parameters and body content

### 4. Test Generation
- [ ] Automated test cases created
- [ ] Test coverage summary
- [ ] Success/failure rates
- [ ] Generated test scripts

### 5. Analysis Summary
For each website, include:
- Number of unique API endpoints discovered
- Types of API calls (REST, GraphQL, etc.)
- Authentication mechanisms observed
- Data patterns and structures
- Performance characteristics

## 🎯 Success Criteria Checklist

- [ ] **Tested at least 2 websites** with different API patterns
- [ ] **Captured meaningful API interactions** (minimum 5 endpoints per site)
- [ ] **Generated automated test cases** using Keploy
- [ ] **Documented with screenshots** showing the complete process
- [ ] **Analyzed API patterns** and documented findings

## 💡 Pro Tips for Better Results

### 1. Choose Dynamic Websites
- Look for sites with real-time content updates
- Avoid static websites that don't make API calls
- Social media, news sites, and web apps are ideal

### 2. Interact Thoroughly
- Don't just browse - actively interact
- Use search functions, filters, sorting
- Navigate between different sections
- Trigger various user actions

### 3. Monitor Network Tab
- Keep Chrome DevTools Network tab open
- Compare with Keploy's captured calls
- Verify completeness of capture

### 4. Test Different Scenarios
- Logged in vs. logged out experiences
- Different user roles or permissions
- Various device viewport sizes
- Different content types

## 🚨 Common Issues and Solutions

### Issue: No API Calls Captured
**Solutions:**
- Ensure website actually makes API calls
- Check if extension has proper permissions
- Try refreshing the page after starting recording
- Look for single-page applications (SPAs)

### Issue: Extension Not Working
**Solutions:**
- Refresh the browser
- Check Chrome extension permissions
- Try incognito mode
- Update Chrome browser

### Issue: Limited API Interactions
**Solutions:**
- Try different user actions
- Navigate to various sections
- Use search/filter functionality
- Check if authentication is required

## 📤 Submission Format

Create a comprehensive report including:

1. **Summary Table**
   ```
   | Website | API Endpoints | Test Cases | Screenshots |
   |---------|---------------|------------|-------------|
   | Site 1  | 8 endpoints   | 12 tests   | 4 images    |
   | Site 2  | 6 endpoints   | 10 tests   | 4 images    |
   ```

2. **Screenshots Portfolio**
   - Organize by website
   - Include captions and descriptions
   - Show before/after states

3. **Technical Analysis**
   - API patterns observed
   - Authentication methods
   - Data structures
   - Performance insights

4. **Test Results**
   - Generated test cases
   - Success rates
   - Coverage metrics
   - Potential improvements

## 🔗 Helpful Resources

- [Keploy Documentation](https://docs.keploy.io/)
- [Chrome Extension Developer Guide](https://developer.chrome.com/docs/extensions/)
- [API Testing Best Practices](https://docs.keploy.io/concepts/what-is-keploy)
- [REST API Guidelines](https://restfulapi.net/)

## 🎉 Final Notes

This Chrome Extension testing demonstrates real-world API testing scenarios. The skills learned here are directly applicable to:

- **Quality Assurance** - Testing web applications
- **API Development** - Understanding client-server interactions
- **Performance Testing** - Analyzing API response times
- **Security Testing** - Identifying potential vulnerabilities

**Good luck with your testing!** 🚀

Remember to capture clear screenshots and provide detailed documentation for a successful submission. 