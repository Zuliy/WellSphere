import pg from 'pg';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const usePostgres = !!process.env.DATABASE_URL;

let pgPool = null;
let sqliteDb = null;

if (usePostgres) {
  console.log('Connecting to PostgreSQL database...');
  pgPool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
} else {
  console.log('Connecting to local SQLite database...');
  const dbPath = path.resolve('database.sqlite');
  sqliteDb = new sqlite3.Database(dbPath);
}

// Unified query wrapper
export const query = (text, params = []) => {
  return new Promise((resolve, reject) => {
    if (usePostgres) {
      pgPool.query(text, params, (err, res) => {
        if (err) return reject(err);
        resolve({ rows: res.rows });
      });
    } else {
      // Convert PostgreSQL `$1, $2` placeholders to SQLite `?` placeholders
      // and execute
      const sqliteText = text.replace(/\$\d+/g, '?');
      sqliteDb.all(sqliteText, params, (err, rows) => {
        if (err) return reject(err);
        resolve({ rows: rows || [] });
      });
    }
  });
};

// Initialize schema on startup
export const initDB = async () => {
  if (usePostgres) {
    // Schema creation query for PostgreSQL
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        blood_type VARCHAR(5),
        date_of_birth DATE,
        gender VARCHAR(50),
        phone_number VARCHAR(50),
        patient_id VARCHAR(50) UNIQUE,
        auth_id VARCHAR(50) UNIQUE,
        current_medications TEXT,
        chronic_conditions TEXT,
        emergency_contact_name VARCHAR(255),
        emergency_contact_phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS medical_records (
        id UUID PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        hospital_name VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        diagnosis VARCHAR(255) NOT NULL,
        medication TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS allergies (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        allergy VARCHAR(255) NOT NULL
      );
    `;
    try {
      await pgPool.query(schema);
      console.log('PostgreSQL database schema initialized.');
    } catch (err) {
      console.error('Failed to initialize PostgreSQL schema:', err.message);
    }
  } else {
    // Schema creation query for SQLite
    const createUsers = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        blood_type TEXT,
        date_of_birth TEXT,
        gender TEXT,
        phone_number TEXT,
        patient_id TEXT UNIQUE,
        auth_id TEXT UNIQUE,
        current_medications TEXT,
        chronic_conditions TEXT,
        emergency_contact_name TEXT,
        emergency_contact_phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const createRecords = `
      CREATE TABLE IF NOT EXISTS medical_records (
        id TEXT PRIMARY KEY,
        user_id INTEGER,
        hospital_name TEXT NOT NULL,
        date TEXT NOT NULL,
        diagnosis TEXT NOT NULL,
        medication TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    const createAllergies = `
      CREATE TABLE IF NOT EXISTS allergies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        allergy TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;

    return new Promise((resolve, reject) => {
      sqliteDb.serialize(() => {
        sqliteDb.run(createUsers, (err) => {
          if (err) return reject(err);
        });
        sqliteDb.run(createRecords, (err) => {
          if (err) return reject(err);
        });
        sqliteDb.run(createAllergies, (err) => {
          if (err) return reject(err);
          console.log('SQLite database schema initialized.');
          resolve();
        });
      });
    });
  }
};
