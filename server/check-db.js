import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve('database.sqlite');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Could not connect to database:', err.message);
    process.exit(1);
  }
});

console.log('\n🔍 --- HEALTH PASSPORT AI - DATABASE CHECKER --- 🔍\n');

db.serialize(() => {
  // 1. Users Table
  db.all('SELECT id, name, email, blood_type, patient_id, auth_id FROM users', [], (err, rows) => {
    if (err) {
      console.error('Error querying users:', err.message);
      return;
    }
    console.log('👤 REGISTERED USERS & PASSPORTS:');
    if (rows.length === 0) {
      console.log('No users found in database.\n');
    } else {
      console.table(rows);
      console.log('\n');
    }

    // 2. Allergies Table
    db.all('SELECT id, user_id, allergy FROM allergies', [], (err, rows) => {
      if (err) {
        console.error('Error querying allergies:', err.message);
        return;
      }
      console.log('⚠️ PATIENT ALLERGIES:');
      if (rows.length === 0) {
        console.log('No allergies recorded.\n');
      } else {
        console.table(rows);
        console.log('\n');
      }

      // 3. Medical Records Table
      db.all('SELECT id, user_id, hospital_name, date, diagnosis FROM medical_records', [], (err, rows) => {
        if (err) {
          console.error('Error querying medical records:', err.message);
          return;
        }
        console.log('📋 CLINICAL MEDICAL RECORDS:');
        if (rows.length === 0) {
          console.log('No medical records found.\n');
        } else {
          console.table(rows);
          console.log('\n');
        }
        db.close();
      });
    });
  });
});
