require('dotenv').config(); // Load environment variables from .env file
const app = require('./src/app');
const mongoose = require('mongoose');
const { mongoURI } = require('./src/config/database');

// Use port 5001 as default you can change it later 
const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    // Connect to MongoDB using the URI from your config file
    await mongoose.connect(mongoURI);
    console.log('🗄️  Connected to MongoDB');

    // Start the Express app
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
