const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// GET /api/tasks - Retrieve all tasks
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tasks',
            error: error.message
        });
    }
});

// GET /api/tasks/:id - Retrieve a specific task by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch task',
            error: error.message
        });
    }
});

// GET /api/tasks/status/:status - Filter tasks by status
router.get('/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const validStatuses = ['pending', 'in-progress', 'completed'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: pending, in-progress, completed'
            });
        }

        const [rows] = await db.execute('SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC', [status]);

        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching tasks by status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tasks by status',
            error: error.message
        });
    }
});

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
    try {
        const { title, description, status = 'pending' } = req.body;

        // Validation
        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        const validStatuses = ['pending', 'in-progress', 'completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be one of: pending, in-progress, completed'
            });
        }

        const [result] = await db.execute(
            'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)',
            [title.trim(), description || '', status]
        );

        // Fetch the created task
        const [newTask] = await db.execute('SELECT * FROM tasks WHERE id = ?', [result.insertId]);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: newTask[0]
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create task',
            error: error.message
        });
    }
});

// PUT /api/tasks/:id - Update an existing task
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        // Check if task exists
        const [existingTask] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);
        if (existingTask.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Validation
        if (status) {
            const validStatuses = ['pending', 'in-progress', 'completed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status. Must be one of: pending, in-progress, completed'
                });
            }
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (title !== undefined) {
            if (title.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Title cannot be empty'
                });
            }
            updates.push('title = ?');
            values.push(title.trim());
        }

        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }

        if (status !== undefined) {
            updates.push('status = ?');
            values.push(status);
        }

        if (updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        values.push(id);

        await db.execute(
            `UPDATE tasks SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            values
        );

        // Fetch updated task
        const [updatedTask] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Task updated successfully',
            data: updatedTask[0]
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update task',
            error: error.message
        });
    }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Check if task exists
        const [existingTask] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);
        if (existingTask.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        await db.execute('DELETE FROM tasks WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete task',
            error: error.message
        });
    }
});

module.exports = router; 