/**
 * Performance and Load Testing Suite
 * Tests API performance under various load conditions
 * 
 * @author KIIT Student - Keploy Fellowship Session 2
 */

const request = require('supertest');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const tasksRoutes = require('../routes/tasks-sqlite');
app.use('/api/tasks', tasksRoutes);

describe('⚡ Performance Testing Suite', () => {
    let createdTaskIds = [];

    beforeAll(async () => {
        console.log('🚀 Starting Performance Tests...');
    });

    afterAll(async () => {
        // Clean up all created tasks
        for (const taskId of createdTaskIds) {
            try {
                await request(app).delete(`/api/tasks/${taskId}`);
            } catch (error) {
                // Ignore cleanup errors
            }
        }
        console.log('✅ Performance Tests Completed');
    });

    describe('📈 Response Time Tests', () => {
        test('GET /api/tasks should respond within 100ms', async () => {
            const startTime = Date.now();

            const response = await request(app)
                .get('/api/tasks')
                .expect(200);

            const responseTime = Date.now() - startTime;

            expect(responseTime).toBeLessThan(100);
            expect(response.body.success).toBe(true);

            console.log(`📊 GET /api/tasks response time: ${responseTime}ms`);
        });

        test('POST /api/tasks should respond within 200ms', async () => {
            const startTime = Date.now();

            const response = await request(app)
                .post('/api/tasks')
                .send({
                    title: 'Performance Test Task',
                    description: 'Testing response time'
                })
                .expect(201);

            const responseTime = Date.now() - startTime;

            expect(responseTime).toBeLessThan(200);
            expect(response.body.success).toBe(true);

            createdTaskIds.push(response.body.data.id);

            console.log(`📊 POST /api/tasks response time: ${responseTime}ms`);
        });

        test('PUT /api/tasks/:id should respond within 150ms', async () => {
            // Create a task first
            const createResponse = await request(app)
                .post('/api/tasks')
                .send({ title: 'Task for Update Test' });

            const taskId = createResponse.body.data.id;
            createdTaskIds.push(taskId);

            const startTime = Date.now();

            await request(app)
                .put(`/api/tasks/${taskId}`)
                .send({ status: 'completed' })
                .expect(200);

            const responseTime = Date.now() - startTime;

            expect(responseTime).toBeLessThan(150);

            console.log(`📊 PUT /api/tasks/:id response time: ${responseTime}ms`);
        });

        test('DELETE /api/tasks/:id should respond within 100ms', async () => {
            // Create a task first
            const createResponse = await request(app)
                .post('/api/tasks')
                .send({ title: 'Task for Delete Test' });

            const taskId = createResponse.body.data.id;

            const startTime = Date.now();

            await request(app)
                .delete(`/api/tasks/${taskId}`)
                .expect(200);

            const responseTime = Date.now() - startTime;

            expect(responseTime).toBeLessThan(100);

            console.log(`📊 DELETE /api/tasks/:id response time: ${responseTime}ms`);
        });
    });

    describe('🔥 Load Testing', () => {
        test('Handle 10 concurrent GET requests', async () => {
            const startTime = Date.now();

            const promises = Array(10).fill().map(() =>
                request(app).get('/api/tasks').expect(200)
            );

            const responses = await Promise.all(promises);
            const totalTime = Date.now() - startTime;

            // All requests should succeed
            responses.forEach(response => {
                expect(response.body.success).toBe(true);
            });

            // Average response time should be reasonable
            const avgResponseTime = totalTime / 10;
            expect(avgResponseTime).toBeLessThan(500);

            console.log(`📊 10 concurrent GET requests completed in ${totalTime}ms (avg: ${avgResponseTime}ms)`);
        });

        test('Handle 5 concurrent POST requests', async () => {
            const startTime = Date.now();

            const promises = Array(5).fill().map((_, index) =>
                request(app)
                    .post('/api/tasks')
                    .send({
                        title: `Load Test Task ${index + 1}`,
                        description: `Created during load test`
                    })
                    .expect(201)
            );

            const responses = await Promise.all(promises);
            const totalTime = Date.now() - startTime;

            // All requests should succeed and create unique tasks
            const taskIds = responses.map(r => r.body.data.id);
            const uniqueIds = [...new Set(taskIds)];

            expect(uniqueIds.length).toBe(5); // All IDs should be unique
            expect(responses.length).toBe(5);

            // Store IDs for cleanup
            createdTaskIds.push(...taskIds);

            const avgResponseTime = totalTime / 5;
            expect(avgResponseTime).toBeLessThan(1000);

            console.log(`📊 5 concurrent POST requests completed in ${totalTime}ms (avg: ${avgResponseTime}ms)`);
        });

        test('Handle mixed concurrent operations', async () => {
            // Create some tasks first for update/delete operations
            const setupTasks = await Promise.all([
                request(app).post('/api/tasks').send({ title: 'Task for Update' }),
                request(app).post('/api/tasks').send({ title: 'Task for Delete' })
            ]);

            const updateTaskId = setupTasks[0].body.data.id;
            const deleteTaskId = setupTasks[1].body.data.id;
            createdTaskIds.push(updateTaskId); // deleteTaskId will be deleted

            const startTime = Date.now();

            const mixedPromises = [
                // GET requests
                request(app).get('/api/tasks'),
                request(app).get('/api/tasks/status/pending'),
                // POST request
                request(app).post('/api/tasks').send({ title: 'Mixed Load Test' }),
                // PUT request
                request(app).put(`/api/tasks/${updateTaskId}`).send({ status: 'completed' }),
                // DELETE request
                request(app).delete(`/api/tasks/${deleteTaskId}`)
            ];

            const responses = await Promise.all(mixedPromises);
            const totalTime = Date.now() - startTime;

            // Check that all operations succeeded
            expect(responses[0].status).toBe(200); // GET all
            expect(responses[1].status).toBe(200); // GET by status
            expect(responses[2].status).toBe(201); // POST
            expect(responses[3].status).toBe(200); // PUT
            expect(responses[4].status).toBe(200); // DELETE

            // Store created task ID
            createdTaskIds.push(responses[2].body.data.id);

            console.log(`📊 5 mixed concurrent operations completed in ${totalTime}ms`);
        });
    });

    describe('📊 Throughput Testing', () => {
        test('Create and read 20 tasks rapidly', async () => {
            const startTime = Date.now();
            const taskCount = 20;

            // Create tasks
            const createPromises = Array(taskCount).fill().map((_, index) =>
                request(app)
                    .post('/api/tasks')
                    .send({
                        title: `Throughput Test Task ${index + 1}`,
                        description: `Testing throughput with task ${index + 1}`
                    })
            );

            const createResponses = await Promise.all(createPromises);
            const createTime = Date.now() - startTime;

            // All creates should succeed
            createResponses.forEach(response => {
                expect(response.status).toBe(201);
                createdTaskIds.push(response.body.data.id);
            });

            // Read all tasks
            const readStartTime = Date.now();
            const readResponse = await request(app).get('/api/tasks');
            const readTime = Date.now() - readStartTime;

            expect(readResponse.status).toBe(200);
            expect(readResponse.body.data.length).toBeGreaterThanOrEqual(taskCount);

            const totalTime = Date.now() - startTime;
            const throughput = (taskCount * 1000) / createTime; // tasks per second

            console.log(`📊 Created ${taskCount} tasks in ${createTime}ms (${throughput.toFixed(2)} tasks/sec)`);
            console.log(`📊 Read ${readResponse.body.data.length} tasks in ${readTime}ms`);
            console.log(`📊 Total operation time: ${totalTime}ms`);

            expect(throughput).toBeGreaterThan(5); // At least 5 tasks per second
        });
    });

    describe('💾 Memory and Resource Testing', () => {
        test('Handle large task descriptions without memory issues', async () => {
            const largeDescription = 'A'.repeat(10000); // 10KB description

            const response = await request(app)
                .post('/api/tasks')
                .send({
                    title: 'Large Description Test',
                    description: largeDescription
                })
                .expect(201);

            expect(response.body.data.description.length).toBe(10000);
            createdTaskIds.push(response.body.data.id);
        });

        test('Handle multiple large tasks', async () => {
            const largeDescription = 'B'.repeat(5000); // 5KB each
            const taskCount = 5;

            const promises = Array(taskCount).fill().map((_, index) =>
                request(app)
                    .post('/api/tasks')
                    .send({
                        title: `Large Task ${index + 1}`,
                        description: largeDescription
                    })
            );

            const responses = await Promise.all(promises);

            responses.forEach(response => {
                expect(response.status).toBe(201);
                expect(response.body.data.description.length).toBe(5000);
                createdTaskIds.push(response.body.data.id);
            });
        });
    });

    describe('🔄 Stress Testing', () => {
        test('Rapid create-update-delete cycles', async () => {
            const cycles = 10;
            const startTime = Date.now();

            for (let i = 0; i < cycles; i++) {
                // Create
                const createResponse = await request(app)
                    .post('/api/tasks')
                    .send({
                        title: `Stress Test Task ${i + 1}`,
                        description: 'Stress testing rapid operations'
                    })
                    .expect(201);

                const taskId = createResponse.body.data.id;

                // Update
                await request(app)
                    .put(`/api/tasks/${taskId}`)
                    .send({ status: 'completed' })
                    .expect(200);

                // Delete
                await request(app)
                    .delete(`/api/tasks/${taskId}`)
                    .expect(200);
            }

            const totalTime = Date.now() - startTime;
            const cyclesPerSecond = (cycles * 1000) / totalTime;

            console.log(`📊 Completed ${cycles} create-update-delete cycles in ${totalTime}ms`);
            console.log(`📊 Cycles per second: ${cyclesPerSecond.toFixed(2)}`);

            expect(cyclesPerSecond).toBeGreaterThan(1); // At least 1 cycle per second
        });
    });
}); 