const express = require('express');
const cors = require('cors');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { typeDefs } = require('./graphql/typeDefs');
const { resolvers } = require('./graphql/resolvers');
const releaseRoutes = require('./routes/releaseRoutes');

async function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Release Checklist Tool API', timestamp: new Date() });
  });

  // REST API routes
  app.use('/api', releaseRoutes);

  // GraphQL server initialization
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  app.use('/graphql', expressMiddleware(apolloServer));

  // Serve static frontend in production (Single Service Deployment)
  const frontendDist = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/graphql') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
      if (err) next();
    });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  });

  return app;
}

module.exports = { createApp };
