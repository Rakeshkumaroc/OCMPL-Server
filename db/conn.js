const mongoose = require('mongoose');
require("dotenv").config();

const DB = process.env.DatabaseUrl;

// Debug: Log the DB URI to ensure it's loaded
console.log("Database URI:", DB);

if (!DB) {
    console.error("Error: DatabaseUrl is undefined. Check your .env file.");
    process.exit(1); // Exit the process if the URI is undefined
}

mongoose.connect(DB).then(() => {
    console.log('Database is connected');
}).catch((err) => {
    console.log('Database connection failed', err);
});