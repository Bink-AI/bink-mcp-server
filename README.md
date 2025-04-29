# Bink MCP Server

A Model Context Protocol (MCP) server implementation for Bink AI, enabling AI agents to interact with blockchain networks and DeFi applications.

## Overview

Bink MCP Server provides a bridge between AI language models and blockchain functionality through the [Model Context Protocol](https://github.com/modelcontextprotocol/spec). It allows AI agents to perform various blockchain operations including:

- Wallet management
- Token information retrieval 
- DeFi swaps on platforms like PancakeSwap
- Cross-chain bridging
- Price checking and trading

## Features

- 🌐 **Multi-chain Support**: Works with Ethereum, BNB Chain, and Solana networks
- 🔄 **DeFi Integrations**: Connects with PancakeSwap, Jupiter, Thena and other DeFi platforms
- 🔌 **Modular Plugin System**: Extensible architecture with support for swap, bridge, token and wallet plugins
- 🔐 **Secure Wallet Management**: Handles wallet operations securely
- 🤖 **MCP Compatibility**: Fully implements the Model Context Protocol for AI agent integration

## Prerequisites

- Node.js 16+
- Yarn or npm

## Installation

```bash
# Clone the repository
git clone https://github.com/Bink-AI/bink-mcp-server.git
cd bink-mcp-server

# Install dependencies
yarn install
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```
# Wallet configuration
WALLET_MNEMONIC=your_wallet_mnemonic_here
```

## Usage

### Development

```bash
# Start the development server
yarn dev
```

### Production

```bash
# Build the project
yarn build

# Start the server
yarn start
```

## API

This server implements the [Model Context Protocol](https://github.com/modelcontextprotocol/spec), providing the following endpoints:

- `listTools` - Lists available blockchain tools
- `callTool` - Executes blockchain operations
- `listResources` - Lists available resources
- `readResource` - Retrieves resource data

## Development

### Project Structure

- `src/index.ts` - Entry point
- `src/server.ts` - MCP server implementation
- `src/mcp-agent.ts` - Agent bridging MCP to Bink plugins
- `src/utils.ts` - Utility functions
