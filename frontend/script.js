// Task Management API Frontend JavaScript
// Handles all API interactions and form submissions

const API_BASE_URL = '/api/tasks';

// DOM Elements
const resultsContainer = document.getElementById('results');
const tasksContainer = document.getElementById('tasksList');

// Helper function to display results
function displayResults(data, isError = false) {
    const className = isError ? 'error-message' : 'success-message';
    const formattedData = JSON.stringify(data, null, 2);
    resultsContainer.innerHTML = `
        <div class="${className}">
            <strong>${isError ? 'Error' : 'Success'}:</strong>
        </div>
        <pre>${formattedData}</pre>
    `;
}

// Helper function to display tasks in a formatted way
function displayTasks(tasks) {
    if (!tasks || tasks.length === 0) {
        tasksContainer.innerHTML = '<p class="placeholder">No tasks found.</p>';
        return;
    }

    const tasksHTML = tasks.map(task => `
        <div class="task-item">
            <h4>${task.title}</h4>
            <p><strong>ID:</strong> ${task.id}</p>
            <p><strong>Description:</strong> ${task.description || 'No description'}</p>
            <p><strong>Status:</strong> <span class="task-status status-${task.status}">${task.status}</span></p>
            <p><strong>Created:</strong> ${new Date(task.created_at).toLocaleString()}</p>
            <p><strong>Updated:</strong> ${new Date(task.updated_at).toLocaleString()}</p>
        </div>
    `).join('');

    tasksContainer.innerHTML = tasksHTML;
}

// Helper function to make API requests
async function makeAPIRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `HTTP ${response.status}`);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

// Get all tasks
async function getAllTasks() {
    try {
        const data = await makeAPIRequest(API_BASE_URL);
        displayResults(data);
        displayTasks(data.data);
    } catch (error) {
        displayResults({ error: error.message }, true);
    }
}

// Get task by ID
async function getTaskById() {
    const id = document.getElementById('searchId').value.trim();

    if (!id) {
        displayResults({ error: 'Please enter a task ID' }, true);
        return;
    }

    try {
        const data = await makeAPIRequest(`${API_BASE_URL}/${id}`);
        displayResults(data);
        displayTasks([data.data]);
    } catch (error) {
        displayResults({ error: error.message }, true);
    }
}

// Filter tasks by status
async function filterByStatus() {
    const status = document.getElementById('filterStatus').value;

    if (!status) {
        displayResults({ error: 'Please select a status to filter by' }, true);
        return;
    }

    try {
        const data = await makeAPIRequest(`${API_BASE_URL}/status/${status}`);
        displayResults(data);
        displayTasks(data.data);
    } catch (error) {
        displayResults({ error: error.message }, true);
    }
}

// Delete task
async function deleteTask() {
    const id = document.getElementById('deleteId').value.trim();

    if (!id) {
        displayResults({ error: 'Please enter a task ID to delete' }, true);
        return;
    }

    if (!confirm(`Are you sure you want to delete task #${id}?`)) {
        return;
    }

    try {
        const data = await makeAPIRequest(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        displayResults(data);

        // Clear the input
        document.getElementById('deleteId').value = '';

        // Refresh tasks list
        getAllTasks();
    } catch (error) {
        displayResults({ error: error.message }, true);
    }
}

// Create task form handler
document.getElementById('createTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const taskData = {
        title: formData.get('title').trim(),
        description: formData.get('description').trim(),
        status: formData.get('status')
    };

    // Basic validation
    if (!taskData.title) {
        displayResults({ error: 'Title is required' }, true);
        return;
    }

    try {
        const data = await makeAPIRequest(API_BASE_URL, {
            method: 'POST',
            body: JSON.stringify(taskData)
        });

        displayResults(data);

        // Clear form
        e.target.reset();

        // Refresh tasks list
        getAllTasks();
    } catch (error) {
        displayResults({ error: error.message }, true);
    }
});

// Update task form handler
document.getElementById('updateTaskForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const id = formData.get('updateId').trim();

    if (!id) {
        displayResults({ error: 'Task ID is required for update' }, true);
        return;
    }

    // Build update object with only provided fields
    const updateData = {};

    const title = formData.get('updateTitle').trim();
    if (title) updateData.title = title;

    const description = formData.get('updateDescription').trim();
    if (description) updateData.description = description;

    const status = formData.get('updateStatus');
    if (status) updateData.status = status;

    // Check if any fields to update
    if (Object.keys(updateData).length === 0) {
        displayResults({ error: 'Please provide at least one field to update' }, true);
        return;
    }

    try {
        const data = await makeAPIRequest(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });

        displayResults(data);

        // Clear form
        e.target.reset();

        // Refresh tasks list
        getAllTasks();
    } catch (error) {
        displayResults({ error: error.message }, true);
    }
});

// Load tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Task Management API Frontend Loaded');

    // Load initial tasks
    getAllTasks();

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter to create task when in create form
        if (e.ctrlKey && e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && activeElement.closest('#createTaskForm')) {
                document.getElementById('createTaskForm').dispatchEvent(new Event('submit'));
            }
        }

        // F5 to refresh tasks
        if (e.key === 'F5') {
            e.preventDefault();
            getAllTasks();
        }
    });
});

// Add loading states to buttons
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="loading"></span> Loading...';
    button.disabled = true;

    return () => {
        button.innerHTML = originalText;
        button.disabled = false;
    };
}

// Enhanced API request with loading states
async function makeAPIRequestWithLoading(url, options = {}, button = null) {
    let removeLoading;

    if (button) {
        removeLoading = addLoadingState(button);
    }

    try {
        const result = await makeAPIRequest(url, options);
        return result;
    } finally {
        if (removeLoading) {
            removeLoading();
        }
    }
}

// Add input validation and formatting
document.addEventListener('input', (e) => {
    const target = e.target;

    // Auto-trim whitespace on blur
    if (target.type === 'text' || target.tagName === 'TEXTAREA') {
        target.addEventListener('blur', () => {
            target.value = target.value.trim();
        });
    }

    // Validate numeric inputs
    if (target.type === 'number') {
        const value = parseInt(target.value);
        if (isNaN(value) || value < 1) {
            target.setCustomValidity('Please enter a valid positive number');
        } else {
            target.setCustomValidity('');
        }
    }
});

// Add auto-refresh functionality
let autoRefreshInterval;

function startAutoRefresh(intervalMs = 30000) {
    stopAutoRefresh();
    autoRefreshInterval = setInterval(() => {
        getAllTasks();
        console.log('🔄 Auto-refreshed tasks');
    }, intervalMs);
}

function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
}

// Add search functionality
function searchTasks(query) {
    const allTaskItems = document.querySelectorAll('.task-item');
    const searchTerm = query.toLowerCase();

    allTaskItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Export functions for testing
window.TaskAPI = {
    getAllTasks,
    getTaskById,
    filterByStatus,
    deleteTask,
    searchTasks,
    startAutoRefresh,
    stopAutoRefresh
}; 