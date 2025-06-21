const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
require('./db/conn');
app.use(express.json());

// Allow requests from specific origin
const corsOptions = {
    origin: ['http://localhost:5173','http://client.masfinancialservice.in','https://orangecap.media','https://orange-cap-react.vercel.app'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'));
app.use(require('./router/router'));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log('Server is open at localhost:' + PORT);
});

// Database_url =mongodb://127.0.0.1:27017
// Database_url =mongodb+srv://rk:DYgM8g9bpTkGuspm@cluster0.itubz.mongodb.net/ocmdb?retryWrites=true&w=majority&appName=Cluster0