#!/bin/bash

# Task Management API Test Script for Keploy
BASE_URL="http://localhost:3000"

echo "🚀 Testing Task Management API"

# Health check
echo "Testing Health Endpoint..."
curl -X GET "$BASE_URL/health"

# Authentication tests
echo -e "\nTesting Authentication..."
curl -X GET "$BASE_URL/api/auth/demo-credentials"

# Register user
curl -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","email":"test@example.com"}'

# Login
curl -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Task management tests
echo -e "\nTesting Task Management..."
curl -X GET "$BASE_URL/api/tasks"

# Create task
curl -X POST "$BASE_URL/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Testing with Keploy","status":"pending"}'

# Get tasks by status
curl -X GET "$BASE_URL/api/tasks/status/pending"

echo -e "\n✅ API testing completed!" 