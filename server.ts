/**
 * ## server.ts
 * Entry point for the full-stack application
 */

import express from 'express';
import app from './server/src/app';
import { createServer as createViteServer } from 'vite';
import { verifyConnection } from './server/src/config/database';
import { errorHandler, notFoundHandler } from './server/src/middlewares/errorHandler';
import path from 'path';

const PORT = 3000;

async function startServer() {
  // 1. Verify DB Connection
  await verifyConnection(3, 1000); // Fewer retries for faster boot in dev

  // 2. Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // 3. Global handlers (MUST be after app routes and vite middlewares)
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GudangPro running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
