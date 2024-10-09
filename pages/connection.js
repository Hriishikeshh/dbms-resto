import mysql from "mysql2/promise";

export default function connectToDatabase(){
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'restaurant',
        port: 3306
    });
    return pool;
}