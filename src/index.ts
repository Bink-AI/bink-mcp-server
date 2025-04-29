#!/usr/bin/env node
import { createServer } from "./server.js";

/**
 * Main function - Program entry point
 */
async function main() {
  try {
    console.log("Starting BinkAI MCP server");
    const server = await createServer();

    // Start server
    await server.start();
    console.log("Server started successfully");

    // Handle process exit signals
    setupExitHandlers(server);
  } catch (error) {
    console.log("Failed to start server:", error);
    process.exit(1);
  }
}

/**
 * Set up process exit signal handlers
 */
function setupExitHandlers(server: any) {
  const exitHandler = async () => {
    console.log("Shutting down server...");
    await server.stop();
    process.exit(0);
  };

  // Handle various exit signals
  process.on("SIGINT", exitHandler);
  process.on("SIGTERM", exitHandler);
  process.on("SIGUSR1", exitHandler);
  process.on("SIGUSR2", exitHandler);
}

// Start program
main().catch((error) => {
  console.log("Fatal error:", error);
  process.exit(1);
});