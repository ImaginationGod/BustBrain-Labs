import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import formsRouter from './routes/forms.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' })); // allow large payloads if needed

// Connect to MongoDB
await connectDB();

// API routes
app.use('/api', formsRouter);

// API health check
app.get('/api', (req, res) =>
    res.send({ status: 'ok', time: new Date().toISOString() })
);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// React SPA fallback for any non-API route
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '.../frontend/dist/index.html'));
});

// Error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
