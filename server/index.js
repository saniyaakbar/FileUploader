const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const fileRoutes = require('./routes/files');
const folderRoutes = require('./routes/folders');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (adjust the connection string as needed)
mongoose.connect('mongodb://localhost:27017/filemanager', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', (err) => console.error('MongoDB connection error:', err));
mongoose.connection.once('open', () => console.log('Connected to MongoDB'));

// API Routes
app.use('/api', fileRoutes);
app.use('/api', folderRoutes);

// SSE endpoint for upload progress
app.get('/api/progress', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });

  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    res.write(`data: ${progress}\n\n`);
    if (progress >= 100) {
      clearInterval(interval);
      res.end();
    }
  }, 2000);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
