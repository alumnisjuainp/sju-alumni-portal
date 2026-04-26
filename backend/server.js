const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const alumniRoutes = require('./routes/alumniRoutes');

// CRASH-PROOF BACKEND ARCHITECTURE
process.on('uncaughtException', (err) => {
    console.error('🔥 UNCAUGHT EXCEPTION! Shutting down gracefully...');
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('🔥 UNHANDLED REJECTION! Shutting down gracefully...');
    console.error(err.name, err.message, err.stack);
    // In production, you might want to gracefully close the server before exiting.
    // For now, we log the error to prevent silent failures.
});

// Load env variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'https://sju-alumni-portal.vercel.app',
    'https://sju-alumni-portal-git-main-gyaan-09s-projects.vercel.app', // Vercel preview branch
    'https://sju-alumni-frontend-mu8l.onrender.com', // Render frontend
    process.env.FRONTEND_URL, // Dynamic from env (set by render.yaml)
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Default Route
app.get('/', (req, res) => {
    res.send('SJU Alumni Portal API is running!');
});

// Routes
app.use('/api/health', require('./routes/healthRoutes'));
app.use('/api/alumni', alumniRoutes);
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/send-email', require('./routes/emailRoutes'));

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    console.error('🔥 BACKEND CRASH INTERCEPTED:', err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    
    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is actively running on port ${PORT}`);
});
