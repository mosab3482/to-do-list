const { Pool } = require("pg")

if (!process.env.DOCKER_ENV) {
	require("dotenv").config()
}


class DatabaseHelper {
	constructor(pool) {
		this.pool = pool
		this.ready = false
	}

	async init() {
		const createTableQuery = 'CREATE TABLE IF NOT EXISTS tasks ( id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, completed BOOLEAN NOT NULL DEFAULT FALSE);';
		await this.pool.query(createTableQuery);
		console.log("table created---------------")
		this.ready = true
	}


	async getOneTask(id) {
		const res = await this.pool.query("select * from tasks where id = $1;", [id]);
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
		const res = await this.pool.query("update tasks set completed = $2 where id = $2;", [id, done])
		return res.rows.length > 0
	}

	async deleteTask(id) {
		const res = await this.pool.query("delete from tasks id = $1;", [id])
		return res.rows.length > 0
	}

	async close() {
		await this.pool.end();
	}
}


const pool = new Pool({
	host: process.env.POSTGRES_HOST,
	port: process.env.POSTGRES_PORT,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
})

pool.on('connect', () => {
	console.log('Database connected')
})

pool.on('error', (err) => {
	console.log('Database Error: ', err)
})

db = new DatabaseHelper(pool);
db.init()
module.exports = db
