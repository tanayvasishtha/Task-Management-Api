const express = require('express');
const router = express.Router();

// In-memory storage for testing (no database required)
let tasks = [
    {
        id: 1,
        title: "Complete Keploy Fellowship",
        description: "Finish Session 2 assignment with Task Management API",
        status: "in-progress",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 2,
        title: "Learn Node.js",
        description: "Master Express.js and REST API development",
        status: "completed",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 3,
        title: "API Testing",
        description: "Test all CRUD endpoints with curl commands",
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];

let nextId = 4;

// GET /api/tasks - Retrieve all tasks
router.get('/', (req, res) => {
    res.json({
        success: true,
        count: tasks.length,
        data: tasks
    });
});

// GET /api/tasks/:id - Retrieve a specific task by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(t => t.id === parseInt(id));

    if (!task) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }

    res.json({
        success: true,
        data: task
    });
});

// GET /api/tasks/status/:status - Filter tasks by status
router.get('/status/:status', (req, res) => {
    const { status } = req.params;
    const validStatuses = ['pending', 'in-progress', 'completed'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status. Must be one of: pending, in-progress, completed'
        });
    }

    const filteredTasks = tasks.filter(task => task.status === status);

    res.json({
        success: true,
        count: filteredTasks.length,
        data: filteredTasks
    });
});

// POST /api/tasks - Create a new task
router.post('/', (req, res) => {
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

    const newTask = {
        id: nextId++,
        title: title.trim(),
        description: description || '',
        status: status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    tasks.push(newTask);

    res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: newTask
    });
});

// PUT /api/tasks/:id - Update an existing task
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
    if (taskIndex === -1) {
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

    const task = tasks[taskIndex];

    // Update fields if provided
    if (title !== undefined) {
        if (title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Title cannot be empty'
            });
        }
        task.title = title.trim();
    }

    if (description !== undefined) {
        task.description = description;
    }

    if (status !== undefined) {
        task.status = status;
    }

    task.updated_at = new Date().toISOString();

    res.json({
        success: true,
        message: 'Task updated successfully',
        data: task
    });
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const taskIndex = tasks.findIndex(t => t.id === parseInt(id));
    if (taskIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Task not found'
        });
    }

    tasks.splice(taskIndex, 1);

    res.json({
        success: true,
        message: 'Task deleted successfully'
    });
});

module.exports = router; 