import mysql from "mysql2/promise";

export default function connectToDatabase(){
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'prem123',
        database: 'restaurant',
        port: 3306
    });
    return pool;
}