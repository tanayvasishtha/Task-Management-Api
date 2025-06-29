#!/bin/bash

# Task Management API - Test Script for Keploy
# This script demonstrates all API endpoints for testing with Keploy

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# API Base URL
BASE_URL="http://localhost:3000"

echo -e "${BLUE}🚀 Task Management API - Keploy Test Script${NC}"
echo "=================================="

# Function to check if API is running
check_api() {
    echo -e "\n${YELLOW}Checking if API is running...${NC}"
    if curl -f -s "$BASE_URL/health" > /dev/null; then
        echo -e "${GREEN}✅ API is running${NC}"
    else
        echo -e "${RED}❌ API is not running. Please start the server with 'npm start'${NC}"
        exit 1
    fi
}

# Function to test health endpoint
test_health() {
    echo -e "\n${YELLOW}Testing Health Endpoint${NC}"
    echo "GET $BASE_URL/health"
    curl -X GET "$BASE_URL/health" \
        -H "Content-Type: application/json" \
        -w "\nStatus Code: %{http_code}\n" \
        -s | jq '.' || curl -X GET "$BASE_URL/health" -w "\nStatus Code: %{http_code}\n"
}

# Function to test authentication endpoints
test_auth() {
    echo -e "\n${YELLOW}Testing Authentication Endpoints${NC}"
    
    # Get demo credentials
    echo -e "\n📋 Getting demo credentials:"
    echo "GET $BASE_URL/api/auth/demo-credentials"
    curl -X GET "$BASE_URL/api/auth/demo-credentials" \
        -H "Content-Type: application/json" \
        -w "\nStatus Code: %{http_code}\n" \
        -s | jq '.' || curl -X GET "$BASE_URL/api/auth/demo-credentials" -w "\nStatus Code: %{http_code}\n"
    
    # Register a new user
    echo -e "\n📝 Registering new user:"
    echo "POST $BASE_URL/api/auth/register"
    curl -X POST "$BASE_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "keploy_user",
            "password": "keploy123",
            "email": "keploy@test.com"
        }' \
        -w "\nStatus Code: %{http_code}\n" \
        -s | jq '.' || curl -X POST "$BASE_URL/api/auth/register" \
        -H "Content-Type: application/json" \
        -d '{"username":"keploy_user","password":"keploy123","email":"keploy@test.com"}' \
        -w "\nStatus Code: %{http_code}\n"
    
    # Login with the user
    echo -e "\n🔐 Logging in:"
    echo "POST $BASE_URL/api/auth/login"
    TOKEN_RESPONSE=$(curl -X POST "$BASE_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d '{
            "username": "keploy_user",
            "password": "keploy123"
        }' \
        -s)
    
    echo "$TOKEN_RESPONSE" | jq '.' 2>/dev/null || echo "$TOKEN_RESPONSE"
    
    # Extract token if login successful
    TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.data.token // empty' 2>/dev/null || echo "")
    
    if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
        echo -e "\n🎫 Token obtained: ${TOKEN:0:20}..."
        
        # Test profile endpoint
        echo -e "\n👤 Getting user profile:"
        echo "GET $BASE_URL/api/auth/profile"
        curl -X GET "$BASE_URL/api/auth/profile" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -w "\nStatus Code: %{http_code}\n" \
            -s | jq '.' || curl -X GET "$BASE_URL/api/auth/profile" \
            -H "Authorization: Bearer $TOKEN" \
            -w "\nStatus Code: %{http_code}\n"
        
        # Test token verification
        echo -e "\n✅ Verifying token:"
        echo "POST $BASE_URL/api/auth/verify"
        curl -X POST "$BASE_URL/api/auth/verify" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -w "\nStatus Code: %{http_code}\n" \
            -s | jq '.' || curl -X POST "$BASE_URL/api/auth/verify" \
            -H "Authorization: Bearer $TOKEN" \
            -w "\nStatus Code: %{http_code}\n"
    else
        echo -e "${YELLOW}⚠️ Could not extract token, skipping authenticated endpoints${NC}"
    fi
}

# Function to test task endpoints
test_tasks() {
    echo -e "\n${YELLOW}Testing Task Management Endpoints${NC}"
    
    # Get all tasks
    echo -e "\n📋 Getting all tasks:"
    echo "GET $BASE_URL/api/tasks"
    curl -X GET "$BASE_URL/api/tasks" \
        -H "Content-Type: application/json" \
        -w "\nStatus Code: %{http_code}\n" \
        -s | jq '.' || curl -X GET "$BASE_URL/api/tasks" -w "\nStatus Code: %{http_code}\n"
    
    # Create a new task
    echo -e "\n➕ Creating new task:"
    echo "POST $BASE_URL/api/tasks"
    TASK_RESPONSE=$(curl -X POST "$BASE_URL/api/tasks" \
        -H "Content-Type: application/json" \
        -d '{
            "title": "Keploy Test Task",
            "description": "Testing API with Keploy automation",
            "status": "pending"
        }' \
        -s)
    
    echo "$TASK_RESPONSE" | jq '.' 2>/dev/null || echo "$TASK_RESPONSE"
    
    # Extract task ID
    TASK_ID=$(echo "$TASK_RESPONSE" | jq -r '.data.id // empty' 2>/dev/null || echo "")
    
    if [ ! -z "$TASK_ID" ] && [ "$TASK_ID" != "null" ]; then
        echo -e "\n📝 Task created with ID: $TASK_ID"
        
        # Get specific task
        echo -e "\n📄 Getting task by ID:"
        echo "GET $BASE_URL/api/tasks/$TASK_ID"
        curl -X GET "$BASE_URL/api/tasks/$TASK_ID" \
            -H "Content-Type: application/json" \
            -w "\nStatus Code: %{http_code}\n" \
            -s | jq '.' || curl -X GET "$BASE_URL/api/tasks/$TASK_ID" -w "\nStatus Code: %{http_code}\n"
        
        # Update task
        echo -e "\n✏️ Updating task:"
        echo "PUT $BASE_URL/api/tasks/$TASK_ID"
        curl -X PUT "$BASE_URL/api/tasks/$TASK_ID" \
            -H "Content-Type: application/json" \
            -d '{
                "title": "Keploy Test Task - Updated",
                "description": "Updated description for Keploy testing",
                "status": "in-progress"
            }' \
            -w "\nStatus Code: %{http_code}\n" \
            -s | jq '.' || curl -X PUT "$BASE_URL/api/tasks/$TASK_ID" \
            -H "Content-Type: application/json" \
            -d '{"title":"Keploy Test Task - Updated","status":"in-progress"}' \
            -w "\nStatus Code: %{http_code}\n"
        
        # Delete task
        echo -e "\n🗑️ Deleting task:"
        echo "DELETE $BASE_URL/api/tasks/$TASK_ID"
        curl -X DELETE "$BASE_URL/api/tasks/$TASK_ID" \
            -H "Content-Type: application/json" \
            -w "\nStatus Code: %{http_code}\n" \
            -s | jq '.' || curl -X DELETE "$BASE_URL/api/tasks/$TASK_ID" -w "\nStatus Code: %{http_code}\n"
    else
        echo -e "${YELLOW}⚠️ Could not extract task ID, skipping task-specific operations${NC}"
    fi
    
    # Create another task for status filtering
    echo -e "\n➕ Creating task for status testing:"
    curl -X POST "$BASE_URL/api/tasks" \
        -H "Content-Type: application/json" \
        -d '{
            "title": "Pending Task for Status Test",
            "description": "This task will be used to test status filtering",
            "status": "pending"
        }' \
        -s | jq '.' 2>/dev/null || curl -X POST "$BASE_URL/api/tasks" \
        -H "Content-Type: application/json" \
        -d '{"title":"Pending Task","status":"pending"}' \
        -w "\nStatus Code: %{http_code}\n"
    
    # Test status filtering
    echo -e "\n🔍 Filtering tasks by status:"
    for status in "pending" "in-progress" "completed"; do
        echo "GET $BASE_URL/api/tasks/status/$status"
        curl -X GET "$BASE_URL/api/tasks/status/$status" \
            -H "Content-Type: application/json" \
            -w "\nStatus Code: %{http_code}\n" \
            -s | jq '.' || curl -X GET "$BASE_URL/api/tasks/status/$status" -w "\nStatus Code: %{http_code}\n"
        echo ""
    done
}

# Function to test error cases
test_error_cases() {
    echo -e "\n${YELLOW}Testing Error Cases${NC}"
    
    # Test invalid task creation
    echo -e "\n❌ Testing invalid task creation (missing title):"
    echo "POST $BASE_URL/api/tasks (without title)"
    curl -X POST "$BASE_URL/api/tasks" \
        -H "Content-Type: application/json" \
        -d '{"description": "Task without title"}' \
        -w "\nStatus Code: %{http_code}\n" \
        -s | jq '.' || curl -X POST "$BASE_URL/api/tasks" \
        -H "Content-Type: application/json" \
        -d '{"description":"Task without title"}' \
        -w "\nStatus Code: %{http_code}\n"
    
    # Test non-existent task
    echo -e "\n❌ Testing non-existent task:"
    echo "GET $BASE_URL/api/tasks/99999"
    curl -X GET "$BASE_URL/api/tasks/99999" \
        -H "Content-Type: application/json" \
        -w "\nStatus Code: %{http_code}\n" \
        -s | jq '.' || curl -X GET "$BASE_URL/api/tasks/99999" -w "\nStatus Code: %{http_code}\n"
    
    # Test invalid status
    echo -e "\n❌ Testing invalid status filter:"
    echo "GET $BASE_URL/api/tasks/status/invalid-status"
    curl -X GET "$BASE_URL/api/tasks/status/invalid-status" \
        -H "Content-Type: application/json" \
        -w "\nStatus Code: %{http_code}\n" \
        -s | jq '.' || curl -X GET "$BASE_URL/api/tasks/status/invalid-status" -w "\nStatus Code: %{http_code}\n"
    
    # Test non-existent route
    echo -e "\n❌ Testing non-existent route:"
    echo "GET $BASE_URL/api/nonexistent"
    curl -X GET "$BASE_URL/api/nonexistent" \
        -H "Content-Type: application/json" \
        -w "\nStatus Code: %{http_code}\n" \
        -s | jq '.' || curl -X GET "$BASE_URL/api/nonexistent" -w "\nStatus Code: %{http_code}\n"
}

# Main execution
main() {
    check_api
    test_health
    test_auth
    test_tasks
    test_error_cases
    
    echo -e "\n${GREEN}🎉 All API tests completed!${NC}"
    echo -e "${BLUE}📊 Use this script with Keploy to record and replay API tests${NC}"
    echo -e "${BLUE}💡 Run: keploy record --config-path=keploy.yml${NC}"
}

# Run main function
main "$@" 