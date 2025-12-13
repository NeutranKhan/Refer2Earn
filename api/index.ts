import { app } from '../server/app.js';
import { registerRoutes } from '../server/routes.js';
import { createServer } from 'http';

// Initialize the app lazily
let initialized = false;

export default async function handler(req: any, res: any) {
    if (!initialized) {
        // Modify routes registration to work without the actual HTTP server listening
        // We pass a dummy server object because registerRoutes expects it, 
        // but on Vercel we piggyback on the serverless handler.
        const httpServer = createServer(app);
        await registerRoutes(httpServer, app);
        initialized = true;
    }

    // Forward request to Express app
    return app(req, res);
}
