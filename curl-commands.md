# 🧪 API Testing - Curl Commands Reference

Quick reference for testing the Task Management API endpoints using curl.

## Base URL
```
http://localhost:3000
```

## Health Check

```bash
# Check if API is running
curl -X GET http://localhost:3000/health
```

## Authentication Endpoints

### Get Demo Credentials
```bash
curl -X GET http://localhost:3000/api/auth/demo-credentials
```

### Register New User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "email": "test@example.com"
  }'
```

### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123"
  }'
```

### Get User Profile (requires token)
```bash
# Replace YOUR_TOKEN with actual token from login response
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Verify Token
```bash
curl -X POST http://localhost:3000/api/auth/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Task Management Endpoints

### Get All Tasks
```bash
curl -X GET http://localhost:3000/api/tasks
```

### Create New Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete API documentation",
    "description": "Write comprehensive API documentation with examples",
    "status": "pending"
  }'
```

### Get Specific Task
```bash
# Replace 1 with actual task ID
curl -X GET http://localhost:3000/api/tasks/1
```

### Update Task
```bash
# Replace 1 with actual task ID
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "description": "Updated description",
    "status": "in-progress"
  }'
```

### Delete Task
```bash
# Replace 1 with actual task ID
curl -X DELETE http://localhost:3000/api/tasks/1
```

### Filter Tasks by Status
```bash
# Get pending tasks
curl -X GET http://localhost:3000/api/tasks/status/pending

# Get in-progress tasks
curl -X GET http://localhost:3000/api/tasks/status/in-progress

# Get completed tasks
curl -X GET http://localhost:3000/api/tasks/status/completed
```

## Error Testing

### Invalid Task Creation (missing title)
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Task without title"
  }'
```

### Invalid Status
```bash
curl -X GET http://localhost:3000/api/tasks/status/invalid-status
```

### Non-existent Task
```bash
curl -X GET http://localhost:3000/api/tasks/99999
```

### Non-existent Route
```bash
curl -X GET http://localhost:3000/api/nonexistent
```

## Testing Workflow Example

Here's a complete testing workflow:

```bash
# 1. Check API health
curl -X GET http://localhost:3000/health

# 2. Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","email":"test@example.com"}'

# 3. Login to get token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}' | jq -r '.data.token')

# 4. Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Testing API","status":"pending"}'

# 5. Get all tasks
curl -X GET http://localhost:3000/api/tasks

# 6. Filter pending tasks
curl -X GET http://localhost:3000/api/tasks/status/pending
```

## Expected Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

## Status Codes

- `200` - OK (successful GET, PUT)
- `201` - Created (successful POST)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication failed)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (username already exists)
- `500` - Internal Server Error

## Pro Tips

1. **Use jq for JSON formatting:**
   ```bash
   curl http://localhost:3000/api/tasks | jq '.'
   ```

2. **Save token for reuse:**
   ```bash
   TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","password":"test123"}' | jq -r '.data.token')
   ```

3. **Add verbose output for debugging:**
   ```bash
   curl -v -X GET http://localhost:3000/api/tasks
   ```

4. **Show HTTP status code:**
   ```bash
   curl -w "Status: %{http_code}\n" http://localhost:3000/health
   ``` 