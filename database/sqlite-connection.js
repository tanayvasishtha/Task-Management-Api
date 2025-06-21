const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file path
const dbPath = path.join(__dirname, '..', 'tasks.db');

// Create connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ SQLite connection failed:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database schema
function initializeDatabase() {
    const createTableSQL = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('pending', 'in-progress', 'completed')) DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

    db.run(createTableSQL, (err) => {
        if (err) {
            console.error('Error creating tasks table:', err.message);
        } else {
            console.log('✅ Tasks table ready');
            insertSampleData();
        }
    });
}

// Insert sample data if table is empty
function insertSampleData() {
    db.get('SELECT COUNT(*) as count FROM tasks', (err, row) => {
        if (err) {
            console.error('Error checking data:', err.message);
            return;
        }

        if (row.count === 0) {
            const sampleTasks = [
                {
                    title: 'Complete Keploy Fellowship',
                    description: 'Finish Session 2 assignment with Task Management API',
                    status: 'in-progress'
                },
                {
                    title: 'Learn Node.js',
                    description: 'Master Express.js and REST API development',
                    status: 'completed'
                },
                {
                    title: 'API Testing',
                    description: 'Test all CRUD endpoints with curl commands',
                    status: 'pending'
                }
            ];

            const insertSQL = `INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)`;

            sampleTasks.forEach(task => {
                db.run(insertSQL, [task.title, task.description, task.status], (err) => {
                    if (err) {
                        console.error('Error inserting sample data:', err.message);
                    }
                });
            });

            console.log('✅ Sample data inserted');
        }
    });
}

// Promisify database operations for easier use
const dbAsync = {
    all: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },

    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }
};

module.exports = dbAsync; 