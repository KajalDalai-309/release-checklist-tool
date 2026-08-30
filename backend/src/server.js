require('dotenv').config();
const { createApp } = require('./app');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const app = await createApp();
    app.listen(PORT, () => {
      console.log(`🚀 Release Checklist API Server running on port ${PORT}`);
      console.log(`📡 REST API endpoint: http://localhost:${PORT}/api/releases`);
      console.log(`🪐 GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
