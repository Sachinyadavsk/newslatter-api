
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
try {
    const connection = await pool.getConnection();
    console.log('MySQL Database Connected Successfully!');
    connection.release();
} catch (error) {
    console.error('Error connecting to database:', error.message);
    process.exit(1);
}

export default pool;
