import app from './app';
import { setupProcessHandlers } from './utils/processHandlers';

const PORT = process.env.PORT || 4000;

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Setup global error handlers and graceful shutdown
setupProcessHandlers(server);
