const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const userRoutes = require("./routes/userRoutes");
const enquiryRoutes = require("./routes/enquireRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const jobRoutes = require("./routes/jobRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const projectRoutes = require("./routes/projectRoutes");

// Config
dotenv.config({ path: './config.env' });
require('./db/conn');
app.use(express.json());

// Allow requests from specific origins
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://client.masfinancialservice.in',
        'https://ocmpl.orangecap.media',
        'https://orangecap.media',
        'https://orange-cap-react.vercel.app'
    ],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

//  Static file serving
app.use('/uploads', express.static('uploads')); // Generic
app.use('/uploads/resume', express.static('uploads/resume'));
app.use('/uploads/service', express.static('uploads/service'));
app.use('/uploads/project', express.static('uploads/project'));



//  Modular Routes
app.use("/api/user", userRoutes);
app.use("/api/enquire", enquiryRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/service", serviceRoutes);
app.use("/api/projects", projectRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 4006;
app.listen(PORT, () => {
    console.log('Server is open at localhost:' + PORT);
});
