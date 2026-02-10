require("dotenv").config()
const { Pool } = require("pg")


async function initDB() {
	const pool = new Pool({
		host: process.env.PG_HOST,
		port: process.env.PG_HOST_PORT,
		user: process.env.PG_USER,
		password: process.env.PG_PASSWORD,
		database: process.env.PG_DATABASE,
	})

	pool.on('connect', () => {
		console.log('Database connected')
	})

	pool.on('error', (err) => {
		console.log('Database Error: ', err)
	})

	const createTableQuery = 'CREATE TABLE IF NOT EXISTS users ( id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, completed BOOLEAN NOT NULL DEFAULT TRUE);';

	await pool.query(createTableQuery);

	return new DatabaseHelper(pool);
}

class DatabaseHelper {
	constructor(pool) {
		this.pool = pool
	}


	async getOneTask(id) {
		const res = await this.pool.query("select * from whare tasks id = $1;", [id]);
		return res.rows.length > 0;
	}

	async getAllTasks() {
		const res = await this.pool.query("select * from tasks;");
		return res.rows;
	}

	async addTask(name) {
		const res = await this.pool.query("insert into tasks (name) values ($1);", [name]);
		return res.rows[0];
	}

	async updateTask(id, done) {
		const res = await this.pool.query("update tasks set completed = $2 whare id = $2;", [id, done])
		return res.rows.length > 0
	}

	async deleteTask(id) {
		const res = await this.pool.query("delet from tasks id = $1;", [id])
		return res.rows.length > 0
	}

	async close() {
		await this.pool.end();
	}
}


module.exports = initDB()
