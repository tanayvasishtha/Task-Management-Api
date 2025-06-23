/**
 * Integration Tests - Full Workflow Testing
 * Tests complete user workflows and real-world scenarios
 * 
 * @author KIIT Student - Keploy Fellowship Session 2
 */

const request = require('supertest');
const express = require('express');
const cors = require('cors');

// Create test app
const app = express();
app.use(cors());
app.use(express.json());

const tasksRoutes = require('../../routes/tasks-sqlite');
app.use('/api/tasks', tasksRoutes);

describe('🔗 Integration Tests - Full Workflows', () => {

    describe('👤 Complete User Journey', () => {
        let projectTaskId, bugTaskId, featureTaskId;

        test('User creates a complete project workflow', async () => {
            // 1. Create project task
            const projectTask = await request(app)
                .post('/api/tasks')
                .send({
                    title: 'Build Task Management API',
                    description: 'Complete project for Keploy Fellowship',
                    status: 'in-progress'
                })
                .expect(201);

            projectTaskId = projectTask.body.data.id;
            expect(projectTask.body.data.title).toBe('Build Task Management API');

            // 2. Create subtasks
            const bugTask = await request(app)
                .post('/api/tasks')
                .send({
                    title: 'Fix authentication bug',
                    description: 'User login not working properly',
                    status: 'pending'
                })
                .expect(201);

            bugTaskId = bugTask.body.data.id;

            const featureTask = await request(app)
                .post('/api/tasks')
                .send({
                    title: 'Add task filtering',
                    description: 'Allow users to filter tasks by status',
                    status: 'pending'
                })
                .expect(201);

            featureTaskId = featureTask.body.data.id;

            // 3. Verify all tasks exist
            const allTasks = await request(app)
                .get('/api/tasks')
                .expect(200);

            expect(allTasks.body.data.length).toBeGreaterThanOrEqual(3);
        });

        test('User processes tasks through workflow states', async () => {
            // 1. Start working on bug fix
            const bugInProgress = await request(app)
                .put(`/api/tasks/${bugTaskId}`)
                .send({ status: 'in-progress' })
                .expect(200);

            expect(bugInProgress.body.data.status).toBe('in-progress');

            // 2. Complete bug fix
            const bugCompleted = await request(app)
                .put(`/api/tasks/${bugTaskId}`)
                .send({
                    status: 'completed',
                    description: 'Fixed authentication issue - users can now login properly'
                })
                .expect(200);

            expect(bugCompleted.body.data.status).toBe('completed');

            // 3. Start feature development
            const featureInProgress = await request(app)
                .put(`/api/tasks/${featureTaskId}`)
                .send({ status: 'in-progress' })
                .expect(200);

            expect(featureInProgress.body.data.status).toBe('in-progress');

            // 4. Complete feature
            await request(app)
                .put(`/api/tasks/${featureTaskId}`)
                .send({ status: 'completed' })
                .expect(200);

            // 5. Complete main project
            await request(app)
                .put(`/api/tasks/${projectTaskId}`)
                .send({ status: 'completed' })
                .expect(200);
        });

        test('User reviews completed work', async () => {
            // Get all completed tasks
            const completedTasks = await request(app)
                .get('/api/tasks/status/completed')
                .expect(200);

            expect(completedTasks.body.data.length).toBeGreaterThanOrEqual(3);

            // Verify specific tasks are completed
            const taskIds = completedTasks.body.data.map(task => task.id);
            expect(taskIds).toContain(projectTaskId);
            expect(taskIds).toContain(bugTaskId);
            expect(taskIds).toContain(featureTaskId);
        });

        test('User cleans up old tasks', async () => {
            // Delete completed subtasks
            await request(app)
                .delete(`/api/tasks/${bugTaskId}`)
                .expect(200);

            await request(app)
                .delete(`/api/tasks/${featureTaskId}`)
                .expect(200);

            // Verify tasks are deleted
            await request(app)
                .get(`/api/tasks/${bugTaskId}`)
                .expect(404);

            await request(app)
                .get(`/api/tasks/${featureTaskId}`)
                .expect(404);

            // Main project task should still exist
            await request(app)
                .get(`/api/tasks/${projectTaskId}`)
                .expect(200);
        });
    });

    describe('📊 Bulk Operations Workflow', () => {
        let taskIds = [];

        test('Create multiple tasks for testing', async () => {
            const taskData = [
                { title: 'Task 1', description: 'First task', status: 'pending' },
                { title: 'Task 2', description: 'Second task', status: 'pending' },
                { title: 'Task 3', description: 'Third task', status: 'in-progress' },
                { title: 'Task 4', description: 'Fourth task', status: 'in-progress' },
                { title: 'Task 5', description: 'Fifth task', status: 'completed' }
            ];

            for (const task of taskData) {
                const response = await request(app)
                    .post('/api/tasks')
                    .send(task)
                    .expect(201);

                taskIds.push(response.body.data.id);
            }

            expect(taskIds.length).toBe(5);
        });

        test('Filter and count tasks by status', async () => {
            // Check pending tasks
            const pendingTasks = await request(app)
                .get('/api/tasks/status/pending')
                .expect(200);

            const pendingCount = pendingTasks.body.data.filter(task =>
                taskIds.includes(task.id)
            ).length;
            expect(pendingCount).toBe(2);

            // Check in-progress tasks
            const inProgressTasks = await request(app)
                .get('/api/tasks/status/in-progress')
                .expect(200);

            const inProgressCount = inProgressTasks.body.data.filter(task =>
                taskIds.includes(task.id)
            ).length;
            expect(inProgressCount).toBe(2);

            // Check completed tasks
            const completedTasks = await request(app)
                .get('/api/tasks/status/completed')
                .expect(200);

            const completedCount = completedTasks.body.data.filter(task =>
                taskIds.includes(task.id)
            ).length;
            expect(completedCount).toBeGreaterThanOrEqual(1);
        });

        test('Update multiple tasks to same status', async () => {
            // Update first 3 tasks to completed
            for (let i = 0; i < 3; i++) {
                await request(app)
                    .put(`/api/tasks/${taskIds[i]}`)
                    .send({ status: 'completed' })
                    .expect(200);
            }

            // Verify updates
            for (let i = 0; i < 3; i++) {
                const task = await request(app)
                    .get(`/api/tasks/${taskIds[i]}`)
                    .expect(200);

                expect(task.body.data.status).toBe('completed');
            }
        });

        test('Clean up test tasks', async () => {
            // Delete all test tasks
            for (const taskId of taskIds) {
                await request(app)
                    .delete(`/api/tasks/${taskId}`)
                    .expect(200);
            }

            // Verify all tasks are deleted
            for (const taskId of taskIds) {
                await request(app)
                    .get(`/api/tasks/${taskId}`)
                    .expect(404);
            }
        });
    });

    describe('🚨 Error Recovery Workflow', () => {
        test('Handle partial failures gracefully', async () => {
            // Create a task
            const task = await request(app)
                .post('/api/tasks')
                .send({
                    title: 'Error Recovery Test',
                    description: 'Testing error handling'
                })
                .expect(201);

            const taskId = task.body.data.id;

            // Try to update with invalid data
            await request(app)
                .put(`/api/tasks/${taskId}`)
                .send({ status: 'invalid-status' })
                .expect(400);

            // Verify original task is unchanged
            const originalTask = await request(app)
                .get(`/api/tasks/${taskId}`)
                .expect(200);

            expect(originalTask.body.data.status).toBe('pending');
            expect(originalTask.body.data.title).toBe('Error Recovery Test');

            // Valid update should still work
            await request(app)
                .put(`/api/tasks/${taskId}`)
                .send({ status: 'completed' })
                .expect(200);

            // Clean up
            await request(app)
                .delete(`/api/tasks/${taskId}`)
                .expect(200);
        });

        test('Handle concurrent operations', async () => {
            // Create a task
            const task = await request(app)
                .post('/api/tasks')
                .send({
                    title: 'Concurrent Test',
                    description: 'Testing concurrent operations'
                })
                .expect(201);

            const taskId = task.body.data.id;

            // Perform multiple concurrent updates
            const updatePromises = [
                request(app).put(`/api/tasks/${taskId}`).send({ description: 'Update 1' }),
                request(app).put(`/api/tasks/${taskId}`).send({ description: 'Update 2' }),
                request(app).put(`/api/tasks/${taskId}`).send({ status: 'in-progress' })
            ];

            const results = await Promise.all(updatePromises);

            // All should succeed
            results.forEach(result => {
                expect(result.status).toBe(200);
            });

            // Final state should be consistent
            const finalTask = await request(app)
                .get(`/api/tasks/${taskId}`)
                .expect(200);

            expect(finalTask.body.data.id).toBe(taskId);
            expect(finalTask.body.data.title).toBe('Concurrent Test');

            // Clean up
            await request(app)
                .delete(`/api/tasks/${taskId}`)
                .expect(200);
        });
    });
}); 