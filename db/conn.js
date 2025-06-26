const mongoose = require('mongoose');
require("dotenv").config();

const DB = process.env.DatabaseUrl

mongoose.connect(DB).then(() => {
    console.log('Database is connected');
}).catch((err) => {
    console.log('Database connection failed', err);
});