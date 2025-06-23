/**
 * Task Management API - Comprehensive Test Suite
 * Testing all CRUD operations and edge cases
 * 
 * @author KIIT Student - Keploy Fellowship Session 2
 * @version 1.0.0
 */

const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Import the SQLite server for testing
const express = require('express');
const cors = require('cors');

// Create test app (similar to server-sqlite.js but for testing)
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import SQLite routes for testing
const tasksRoutes = require('../routes/tasks-sqlite');
app.use('/api/tasks', tasksRoutes);

// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Task Management API is running (Test Mode)',
        database: 'SQLite (Test)',
        version: '1.0.0'
    });
});

describe('Task Management API - Complete Test Suite', () => {
    let testTaskId;

    beforeAll(() => {
        console.log('🧪 Starting API Test Suite...');
    });

    afterAll(() => {
        console.log('✅ API Test Suite Completed');
        // Clean up test database if needed
        const testDbPath = path.join(__dirname, '..', 'tasks.db');
        if (fs.existsSync(testDbPath)) {
            // Keep the database for now - could implement test-specific DB cleanup
        }
    });

    // ===== HEALTH CHECK TESTS =====
    describe('🏥 Health Check Endpoint', () => {
        test('GET /health should return status OK', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toMatchObject({
                status: 'OK',
                message: expect.stringContaining('Task Management API'),
                database: 'SQLite (Test)',
                version: '1.0.0'
            });
        });
    });

    // ===== CRUD OPERATIONS TESTS =====
    describe('📋 Tasks CRUD Operations', () => {

        // CREATE - POST /api/tasks
        describe('✨ CREATE Task', () => {
            test('POST /api/tasks should create a new task', async () => {
                const newTask = {
                    title: 'Test Task',
                    description: 'This is a test task',
                    status: 'pending'
                };

                const response = await request(app)
                    .post('/api/tasks')
                    .send(newTask)
                    .expect(201);

                expect(response.body).toMatchObject({
                    success: true,
                    message: expect.stringContaining('created'),
                    data: expect.objectContaining({
                        id: expect.any(Number),
                        title: newTask.title,
                        description: newTask.description,
                        status: newTask.status,
                        created_at: expect.any(String),
                        updated_at: expect.any(String)
                    })
                });

                testTaskId = response.body.data.id;
            });

            test('POST /api/tasks should create task with default status', async () => {
                const newTask = {
                    title: 'Task with Default Status',
                    description: 'Testing default status'
                };

                const response = await request(app)
                    .post('/api/tasks')
                    .send(newTask)
                    .expect(201);

                expect(response.body.data.status).toBe('pending');
            });

            test('POST /api/tasks should fail with missing title', async () => {
                const invalidTask = {
                    description: 'Task without title'
                };

                const response = await request(app)
                    .post('/api/tasks')
                    .send(invalidTask)
                    .expect(400);

                expect(response.body).toMatchObject({
                    success: false,
                    message: 'Title is required'
                });
            });

            test('POST /api/tasks should fail with invalid status', async () => {
                const invalidTask = {
                    title: 'Invalid Status Task',
                    status: 'invalid-status'
                };

                const response = await request(app)
                    .post('/api/tasks')
                    .send(invalidTask)
                    .expect(400);

                expect(response.body.success).toBe(false);
            });
        });

        // READ - GET /api/tasks
        describe('📖 READ Tasks', () => {
            test('GET /api/tasks should return all tasks', async () => {
                const response = await request(app)
                    .get('/api/tasks')
                    .expect(200);

                expect(response.body).toMatchObject({
                    success: true,
                    data: expect.any(Array),
                    count: expect.any(Number)
                });

                expect(response.body.data.length).toBeGreaterThan(0);
            });

            test('GET /api/tasks/:id should return specific task', async () => {
                const response = await request(app)
                    .get(`/api/tasks/${testTaskId}`)
                    .expect(200);

                expect(response.body).toMatchObject({
                    success: true,
                    data: expect.objectContaining({
                        id: testTaskId,
                        title: expect.any(String),
                        status: expect.any(String)
                    })
                });
            });

            test('GET /api/tasks/:id should return 404 for non-existent task', async () => {
                const response = await request(app)
                    .get('/api/tasks/99999')
                    .expect(404);

                expect(response.body.success).toBe(false);
            });

            test('GET /api/tasks/:id should fail with invalid ID', async () => {
                const response = await request(app)
                    .get('/api/tasks/invalid-id')
                    .expect(404);

                expect(response.body).toMatchObject({
                    success: false,
                    message: 'Task not found'
                });
            });
        });

        // READ BY STATUS - GET /api/tasks/status/:status
        describe('🔍 FILTER by Status', () => {
            test('GET /api/tasks/status/pending should return pending tasks', async () => {
                const response = await request(app)
                    .get('/api/tasks/status/pending')
                    .expect(200);

                expect(response.body).toMatchObject({
                    success: true,
                    data: expect.any(Array)
                });

                // All returned tasks should have status 'pending'
                response.body.data.forEach(task => {
                    expect(task.status).toBe('pending');
                });
            });

            test('GET /api/tasks/status/in-progress should return in-progress tasks', async () => {
                const response = await request(app)
                    .get('/api/tasks/status/in-progress')
                    .expect(200);

                expect(response.body.success).toBe(true);
            });

            test('GET /api/tasks/status/completed should return completed tasks', async () => {
                const response = await request(app)
                    .get('/api/tasks/status/completed')
                    .expect(200);

                expect(response.body.success).toBe(true);
            });

            test('GET /api/tasks/status/invalid should return 400', async () => {
                const response = await request(app)
                    .get('/api/tasks/status/invalid-status')
                    .expect(400);

                expect(response.body.success).toBe(false);
            });
        });

        // UPDATE - PUT /api/tasks/:id
        describe('✏️ UPDATE Task', () => {
            test('PUT /api/tasks/:id should update task', async () => {
                const updates = {
                    title: 'Updated Test Task',
                    description: 'Updated description',
                    status: 'in-progress'
                };

                const response = await request(app)
                    .put(`/api/tasks/${testTaskId}`)
                    .send(updates)
                    .expect(200);

                expect(response.body).toMatchObject({
                    success: true,
                    message: expect.stringContaining('updated'),
                    data: expect.objectContaining({
                        id: testTaskId,
                        title: updates.title,
                        description: updates.description,
                        status: updates.status
                    })
                });
            });

            test('PUT /api/tasks/:id should update only provided fields', async () => {
                const updates = {
                    status: 'completed'
                };

                const response = await request(app)
                    .put(`/api/tasks/${testTaskId}`)
                    .send(updates)
                    .expect(200);

                expect(response.body.data.status).toBe('completed');
                expect(response.body.data.title).toBe('Updated Test Task'); // Should remain unchanged
            });

            test('PUT /api/tasks/:id should return 404 for non-existent task', async () => {
                const updates = { title: 'Updated Title' };

                const response = await request(app)
                    .put('/api/tasks/99999')
                    .send(updates)
                    .expect(404);

                expect(response.body.success).toBe(false);
            });

            test('PUT /api/tasks/:id should fail with invalid status', async () => {
                const invalidUpdates = {
                    status: 'invalid-status'
                };

                const response = await request(app)
                    .put(`/api/tasks/${testTaskId}`)
                    .send(invalidUpdates)
                    .expect(400);

                expect(response.body.success).toBe(false);
            });
        });

        // DELETE - DELETE /api/tasks/:id
        describe('🗑️ DELETE Task', () => {
            let taskToDelete;

            beforeAll(async () => {
                // Create a task specifically for deletion testing
                const newTask = {
                    title: 'Task to Delete',
                    description: 'This task will be deleted'
                };

                const response = await request(app)
                    .post('/api/tasks')
                    .send(newTask);

                taskToDelete = response.body.data.id;
            });

            test('DELETE /api/tasks/:id should delete task', async () => {
                const response = await request(app)
                    .delete(`/api/tasks/${taskToDelete}`)
                    .expect(200);

                expect(response.body).toMatchObject({
                    success: true,
                    message: expect.stringContaining('deleted')
                });

                // Verify task is actually deleted
                const getResponse = await request(app)
                    .get(`/api/tasks/${taskToDelete}`)
                    .expect(404);

                expect(getResponse.body.success).toBe(false);
            });

            test('DELETE /api/tasks/:id should return 404 for non-existent task', async () => {
                const response = await request(app)
                    .delete('/api/tasks/99999')
                    .expect(404);

                expect(response.body.success).toBe(false);
            });

            test('DELETE /api/tasks/:id should fail with invalid ID', async () => {
                const response = await request(app)
                    .delete('/api/tasks/invalid-id')
                    .expect(404);

                expect(response.body).toMatchObject({
                    success: false,
                    message: 'Task not found'
                });
            });
        });
    });

    // ===== ERROR HANDLING TESTS =====
    describe('❌ Error Handling', () => {
        test('Invalid JSON should return 400', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send('invalid-json')
                .set('Content-Type', 'application/json')
                .expect(400);
        });

        test('Non-existent endpoint should return 404', async () => {
            const response = await request(app)
                .get('/api/non-existent')
                .expect(404);
        });

        test('Empty request body for POST should return 400', async () => {
            const response = await request(app)
                .post('/api/tasks')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
        });
    });

    // ===== PERFORMANCE TESTS =====
    describe('⚡ Performance Tests', () => {
        test('API should respond within reasonable time', async () => {
            const startTime = Date.now();

            await request(app)
                .get('/api/tasks')
                .expect(200);

            const responseTime = Date.now() - startTime;
            expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
        });

        test('Multiple concurrent requests should work', async () => {
            const promises = Array(5).fill().map(() =>
                request(app).get('/api/tasks').expect(200)
            );

            const responses = await Promise.all(promises);
            responses.forEach(response => {
                expect(response.body.success).toBe(true);
            });
        });
    });
}); 