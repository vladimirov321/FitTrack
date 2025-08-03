import { Server } from 'http';

export const setupProcessHandlers = (server: Server) => {
  // Global error handlers
  process.on('uncaughtException', (error: Error) => {
    console.error('❌ Uncaught Exception:', error.message);
    console.error(error.stack);
    
    // Log the error (can be sent to a logging service)
    console.error('🚨 Server shutting down due to uncaught exception...');
    
    // Graceful shutdown
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.error('❌ Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
    
    // Log the error (can be sent to a logging service)
    console.error('🚨 Server shutting down due to unhandled promise rejection...');
    
    // Graceful shutdown
    process.exit(1);
  });

  // Graceful shutdown on SIGTERM
  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('✅ Process terminated');
      process.exit(0);
    });
  });

  // Graceful shutdown on SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    console.log('👋 SIGINT received. Shutting down gracefully...');
    server.close(() => {
      console.log('✅ Process terminated');
      process.exit(0);
    });
  });
};
