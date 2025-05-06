import {
    Server
} from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    McpError,
    ErrorCode,
    CallToolRequestSchema,
    ListResourcesRequestSchema,
    ReadResourceRequestSchema,
    ListToolsRequestSchema,
    CallToolRequest,
    Tool,
    ListPromptsRequestSchema,
    GetPromptRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import {
    Agent,
    Wallet,
    Network,
    settings,
    NetworkType,
    NetworksConfig,
    NetworkName,
    logger
} from '@binkai/core';
import { SwapPlugin } from '@binkai/swap-plugin';
import { TokenPlugin } from '@binkai/token-plugin';
import { BirdeyeProvider } from '@binkai/birdeye-provider';
import { WalletPlugin } from '@binkai/wallet-plugin';
import { BnbProvider } from '@binkai/rpc-provider';
import { BridgePlugin } from '@binkai/bridge-plugin';
import { deBridgeProvider } from '@binkai/debridge-provider';

import { JupiterProvider } from '@binkai/jupiter-provider';
import { AlchemyProvider } from '@binkai/alchemy-provider';
import { ThenaProvider } from '@binkai/thena-provider';
import { PancakeSwapProvider } from "@binkai/pancakeswap-provider";
import { FourMemeProvider } from "@binkai/four-meme-provider";
import { VenusProvider } from "@binkai/venus-provider";
import { OkuProvider } from "@binkai/oku-provider";
import { KyberProvider } from "@binkai/kyber-provider";
import { KnowledgePlugin } from '@binkai/knowledge-plugin';
import { BinkProvider } from '@binkai/bink-provider';
import { ImagePlugin } from '@binkai/image-plugin';
import { ethers } from 'ethers';
import { StakingPlugin } from "@binkai/staking-plugin";
import { Connection } from '@solana/web3.js';
import 'dotenv/config';
import { formatError, promptArgumentsFromSchema } from "./utils";
import { MCPAgent } from "./mcp-agent";
import { JsonRpcProvider } from "ethers";
import { prompts } from "./prompts";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";


// Hardcoded RPC URLs for demonstration
const BNB_RPC = 'https://binance.llamarpc.com';
const ETH_RPC = 'https://eth.llamarpc.com';
const SOL_RPC = 'https://api.mainnet-beta.solana.com';

async function createBinkMCPAgent(): Promise<MCPAgent> {
    logger.disable();
    const networks: NetworksConfig['networks'] = {
        bnb: {
            type: 'evm' as NetworkType,
            config: {
                chainId: 56,
                rpcUrl: BNB_RPC,
                name: 'BNB Chain',
                nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18,
                },
            },
        },
        ethereum: {
            type: 'evm' as NetworkType,
            config: {
                chainId: 1,
                rpcUrl: ETH_RPC,
                name: 'Ethereum',
                nativeCurrency: {
                    name: 'Ether',
                    symbol: 'ETH',
                    decimals: 18,
                },
            },
        },
        [NetworkName.SOLANA]: {
            type: 'solana' as NetworkType,
            config: {
                rpcUrl: SOL_RPC,
                name: 'Solana',
                nativeCurrency: {
                    name: 'Solana',
                    symbol: 'SOL',
                    decimals: 9,
                },
            },
        },
    };
    const network = new Network({ networks });

    // Initialize provider
    const provider = new ethers.JsonRpcProvider(BNB_RPC);

    // Initialize a new wallet
    const wallet = new Wallet(
        {
            seedPhrase:
                settings.get('WALLET_MNEMONIC') ||
                'test test test test test test test test test test test test',
            index: 0,
        },
        network,
    );

    
    const agent = new MCPAgent(
        wallet,
        networks,
    );
    const swapPlugin = new SwapPlugin();

    const bridgePlugin = new BridgePlugin();

    const tokenPlugin = new TokenPlugin();

    const stakingPlugin = new StakingPlugin();

    // Create Birdeye provider with API key
    
    const bnbProvider = new BnbProvider({
        rpcUrl: BNB_RPC,
    });
    const bscProvider = new JsonRpcProvider(BNB_RPC);

    const thena = new ThenaProvider(provider, 56);
    const pancakeswap = new PancakeSwapProvider(bscProvider, 56);
    const fourMeme = new FourMemeProvider(bscProvider, 56);
    const venus = new VenusProvider(bscProvider, 56);
    const oku = new OkuProvider(bscProvider, 56);
    const kyber = new KyberProvider(bscProvider, 56);
    const jupiter = new JupiterProvider(new Connection(SOL_RPC))

    const alchemy = new AlchemyProvider({
        apiKey: settings.get('ALCHEMY_API_KEY'),
    });

    const debridge = new deBridgeProvider(
        [bscProvider, new Connection(SOL_RPC)],56,7565164,);
    // Create and configure the wallet plugin
    const walletPlugin = new WalletPlugin();
    // Create provider with API key
 
    // const knowledgePlugin = new KnowledgePlugin();

    // Initialize plugin with provider
    
    const providerWallets = [];
    const providerToken = [];

    const birdeyeApiKey = settings.get('BIRDEYE_API_KEY');
    const alchemyApiKey = settings.get('ALCHEMY_API_KEY');
    providerWallets.push(bnbProvider);

    if (birdeyeApiKey) {
        const birdeye = new BirdeyeProvider({ apiKey: birdeyeApiKey });
        providerWallets.push(birdeye);
    }

    if (alchemyApiKey) {
        const alchemy = new AlchemyProvider({ apiKey: alchemyApiKey });
        providerWallets.push(alchemy);
        providerToken.push(alchemy);

    }
    await walletPlugin.initialize({
        providers: providerWallets,
        supportedChains: ['bnb', 'solana'],
    });

    await swapPlugin.initialize({
        defaultSlippage: 0.5,
        defaultChain: "bnb",
        providers: [pancakeswap, fourMeme, thena, oku, kyber, jupiter],
        supportedChains: ['bnb','solana'],
    });

    await tokenPlugin.initialize({
        defaultChain: "bnb",
        providers: providerToken,
        supportedChains: ["solana", "bnb", "ethereum"],
      }),

    await stakingPlugin.initialize({
        defaultSlippage: 0.5,
        defaultChain: "bnb",
        providers: [venus],
        supportedChains: ["bnb", "ethereum"],
    }),
    await bridgePlugin.initialize({
        defaultChain: "bnb",
        providers: [debridge],
        supportedChains: ["bnb", "solana"],
      }),

    // Register the plugin with the agent
    await agent.registerPlugin(swapPlugin);

    await agent.registerPlugin(walletPlugin);

    await agent.registerPlugin(tokenPlugin);

    await agent.registerPlugin(stakingPlugin);

    await agent.registerPlugin(bridgePlugin);
    return agent;
}

/**
 * Create and configure MCP server
 */
export async function createServer() {

    // Create server instance
    const server = new Server({
        name: "binkai-server",
        version: "1.0.0"
    }, {
        capabilities: {
            tools: {},
            prompts: {}
        }
    });

    const agent = await createBinkMCPAgent();

    // Set up request handlers
    setupRequestHandlers(server, agent);

    // Create STDIO transport
    const transport = new StdioServerTransport();

    return {
        start: async () => {
            try {
                await server.connect(transport);
            } catch (error) {
                console.error("Failed to start server:", error);
                throw error;
            }
        },
        stop: async () => {
            try {
                await server.close();
            } catch (error) {
                console.error("Error stopping server:", error);
            }
        }
    };
}
/**
 * Set up server request handlers
 */
function setupRequestHandlers(server: Server, agent: MCPAgent) {
    // Handle tool calls
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const toolName = request.params.name;
        const toolArgs = request.params.arguments;

        try {
            const response = await agent.invokeTool(toolName, toolArgs);

            let result = response;
            try {
                result = JSON.stringify(JSON.parse(response), null, 2);
            } catch (error) {
            }

            return {
                content: [{
                    type: "text",
                    mimeType: "application/json",
                    text: result
                }]
            };
        } catch (error) {
            return {
                content: [{
                    type: "text",
                    mimeType: "text/plain",
                    text: `${toolName} error: ${formatError(error)}`
                }],
                isError: true
            };
        }
    });

    // Handle tool listing
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return { tools: agent.getMcpTools() };
    });

    // // Handle prompt listing
    server.setRequestHandler(ListPromptsRequestSchema, async () => {
        return { prompts: prompts.map(prompt => ({ name: prompt.name, description: prompt.description, arguments: prompt.arguments ? promptArgumentsFromSchema(prompt.arguments) : undefined })) };
    });

    server.setRequestHandler(GetPromptRequestSchema, async (request) => {
        const promptName = request.params.name;
        const prompt = prompts.find(p => p.name === promptName);

        if (!prompt) {
            throw new McpError(ErrorCode.InvalidParams, `Prompt ${promptName} not found`);
        }

        const parseArgs = await prompt?.arguments?.safeParseAsync(request.params.arguments)

        return await Promise.resolve(prompt?.handler(parseArgs?.data as any) as any);
    });

    // Handle global errors
    process.on("uncaughtException", (error) => {
        console.error("Uncaught exception:", error);
    });

    process.on("unhandledRejection", (reason) => {
        console.error("Unhandled rejection:", reason);
    });
}