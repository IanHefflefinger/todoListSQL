const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    // FIXME: something is awry with .env and this file is not able to parse it properly - fix later
    // host: process.env.HOST,
    host: '127.0.0.1',
    // user: process.env.USER,
    user: 'root',
    // password: process.env.PASSWORD,
    password: 'password',
    // database: process.env.DATABASE,
    database: 'TODO_LIST_DATA',
    // port: process.env.DB_PORT
    port: '3306'
});

connection.connect((error) => {
    if (error) {
        console.log(error.message);
    }
    // console.log('Database: ' + connection.state);
});

class databaseService {
    static getDatabaseServiceInstance() {
        return instance ? instance : new databaseService();
    }

    async getAllData() { // FIXME: rename to getAllTasks
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM todos";

                connection.query(query, (error, results) => {
                    if (error) reject(new Error(err.message));
                    resolve(results);
                });
            });

            // console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }

    async insertNewTask(task) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {
                const query = "INSERT INTO todos (task, date_added) VALUES (?, ?)";

                connection.query(query, [task, dateAdded], (error, result) => {
                    if (error) reject(new Error(err.message));
                    resolve(result.insertId);
                });
            });

            // console.log(insertId);
            return {
                id: insertId,
                task: task,
                dateAdded: dateAdded
            };
        } catch (error) {
            console.log(error);
        }
    }

    async deleteRowById(id) { // FIXME: rename to deleteTaskById (in all locations)
        try {
            id = parseInt(id, 10);
        
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM todos WHERE id = ?";

                connection.query(query, [id], (error, result) => {
                    if (error) reject(new Error(error.message));
                    resolve(result);
                });
            });

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    async updateTaskById(id, task) {
        try {
            id = parseInt(id, 10);
        
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE todos SET task = ? WHERE id = ?";

                connection.query(query, [task, id], (error, result) => {
                    if (error) reject(new Error(error.message));
                    resolve(result.affectedRows);
                });
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
        }
    }

    async getTask(task) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM todos WHERE task = ?";

                connection.query(query, [task], (error, results) => {
                    if (error) reject(new Error(err.message));
                    resolve(results);
                });
            });

            // console.log(response);
            return response;

        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = databaseService;