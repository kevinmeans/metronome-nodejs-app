const mysql = require('mysql');
const express = require("express");

const app = express(),
    bodyParser = require("body-parser"),
    port = 3080;

app.use(bodyParser.json());

const pool = mysql.createPool({
  connectionLimit: 5,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

// Define an HTTP route
app.get('/api/query', (req, res) => {
  // Get parameters from the HTTP request
  const { customer_id, start_time, end_time } = req.query;

  // Simple query to grab requested info
  const sql = `SELECT
    DATE_FORMAT(timestamp, '%Y-%m-%d %H:00:00') AS hour_bucket,
    COUNT(*) AS event_count
    FROM
    metronome.events
    WHERE
    customer_id = '${customer_id}'
    AND timestamp BETWEEN '${start_time}' AND '${end_time}'
    GROUP BY
    customer_id,
    hour_bucket;`
  // Execute the MySQL query
  pool.query(sql, (err, results) => {
    if (err) {
      // Handle MySQL errors
      console.error(err);
      res.status(500).send('Error executing query');
      return;
    }

    // Parse the MySQL query results and return them as JSON
    const parsedResults = results.map(row => ({ hour_bucket: row.hour_bucket, event_count: row.event_count}));
    res.json(parsedResults);
  });
});

// Define an HTTP route
app.put('/api/insert', (req, res) => {
  // Get parameters from the HTTP request body
  const { customer_id, event_type, transaction_id, timestamp } = req.body;
  // Define the MySQL query to execute
  const sql = `INSERT INTO events (customer_id, event_type, transaction_id, timestamp) VALUES ('${customer_id}', '${event_type}', '${transaction_id}', '${timestamp}')`;

  // Execute the MySQL query
  pool.query(sql, (err, results) => {
    if (err) {
      // Handle MySQL errors
      console.error(err);
      res.status(500).send('Error executing query');
      return;
    }

    // Return a success response
    res.status(201).send('Data inserted successfully');
  });
});


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});
