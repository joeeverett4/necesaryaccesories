import sqlite3 from "sqlite3";

// Connect to the database
const db = new sqlite3.Database('databasetwo.sqlite');

// Generate the dates for the next year
const today = new Date();
const yearFromNow = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
const dates = [];
for (let d = new Date(today); d <= yearFromNow; d.setDate(d.getDate() + 1)) {
  dates.push(d.toISOString().slice(0, 10));
}

// Insert the dates into the database
const insertQuery = 'INSERT INTO clicks (date, count) VALUES (?, ?)';
const count = 0;
for (const date of dates) {
  db.run(insertQuery, [date, count], (err) => {
    if (err) {
      console.error(err.message);
    }
  });
}