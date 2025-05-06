import { ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { McpError } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
export const prompts = [
    {
        name: 'swap-token',
        description: 'Swap a token for another token',
        arguments: z.object({
            input_token_address: z.string().describe('The address of the token to swap'),
            output_token_address: z.string().describe('The address of the token to receive'),
            input_amount: z.string().optional().describe('The amount of tokens to swap'),
            output_amount: z.string().optional().describe('The amount of tokens to receive'),
        }),
        handler: ({ input_token_address, output_token_address, input_amount, output_amount }: { input_token_address: string, output_token_address: string, input_amount?: string, output_amount?: string }) => {
            if (!input_amount && !output_amount) {
                throw new McpError(ErrorCode.InvalidParams, "Please provide either an input or output amount");
            }
            if (input_amount) {
                return {
                    messages: [{
                        role: "user",
                        content: {
                            type: "text",
                            text: `I want to swap ${input_amount} ${input_token_address} to ${output_token_address}.`
                        }
                    }]
                };
            } else {
                return {
                    messages: [{
                        role: "user",
                        content: {
                            type: "text",
                            text: `I want to swap ${input_token_address} to ${output_amount} ${output_token_address}.`
                        }
                    }]
                }
            }
        }
    },
    {
        name: 'transfer-token',
        description: 'Transfer a token form your wallet to another address',
        arguments: z.object({
            token: z.string().describe('The token address to transfer'),
            toAddress: z.string().describe('The recipient contract address'),
            amount: z.string().describe('The amount of tokens to transfer'),
            network: z
              .enum(['bnb','solana', 'ethereum'])
              .default('bnb')
              .describe('The blockchain network to execute the transfer on'),
          }),
        handler: ({ token, toAddress, amount, network }: { token: string, toAddress: string, amount: string, network?: string }) => {
            if (!token || !toAddress || !amount) {
                throw new McpError(ErrorCode.InvalidParams, "Please provide a token address, recipient address, and amount");
            }
            return {
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `I want to transfer ${amount} ${token} to ${toAddress} on ${network}.`
                    }
                }]
            }
        }
    },
    {
        name: 'staking-token',
        description: 'Stake and unstake tokens from your wallet using Venus provider',
        arguments: z.object({
            tokenA: z.string().describe('The token A address staking'),
            tokenB: z.string().optional().describe('The token B address staking'),
            amountA: z.string().describe('The amount of token A to stake'),
            amountB: z.string().optional().describe('The amount of token B to stake'),
            type: z
              .enum(['supply', 'withdraw', 'stake', 'unstake'])
              .describe('The type of staking operation to perform.'),
            network: z
              .enum(['bnb','solana', 'ethereum'])
              .default('bnb')
              .describe('The blockchain network to execute the staking on'),
          }),
        handler: ({ tokenA, tokenB, amountA, amountB, type, network }: { tokenA: string, tokenB?: string, amountA: string, amountB?: string, type: string, network?: string }) => {
            if (!tokenA ||!amountA) {
                throw new McpError(ErrorCode.InvalidParams, "Please provide a token address and amount");
                }
            return {
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `I want to ${type} ${amountA} ${tokenA} on ${network}.`
                    }
                }]
            }
        }
    },
    {
        name: 'bridge-token',
        description: 'Bridge or swap crosschain tokens from one blockchain to another',
        arguments: z.object({
            fromNetwork: z
              .enum(['bnb','solana', 'ethereum'])
              .describe('The blockchain network to execute the bridge from'),
            toNetwork: z
              .enum(['bnb','solana', 'ethereum'])
              .describe(
                'The blockchain network to execute the bridge to or on symbor native token. Example: Solana similar SOL or on BNB',
              ),
            fromToken: z.string().describe('The address of send token'),
            toToken: z.string().describe(`The address of receive token`),
            amount: z.string().describe('The amount of tokens to bridge'),
            amountType: z
              .enum(['input', 'output'])
              .describe('Whether the amount is input (spend) or output (receive)'),
          }),
        handler: ({ fromNetwork, toNetwork, fromToken, toToken, amount, amountType }: { fromNetwork: string, toNetwork: string, fromToken: string, toToken: string, amount: string, amountType: string }) => {
            if (!fromToken ||!toToken ||!amount) {
                throw new McpError(ErrorCode.InvalidParams, "Please provide a token address and amount");
            }
            return {
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `I want to ${amountType} ${amount} ${fromToken} on ${fromNetwork} to ${toNetwork} using ${toToken}.`
                    }
                }]
            }
        }
    },
    {
        name: 'get-balance',
        description: 'Get the balance of my wallet',
        arguments: z.object({
            address: z.string().describe('The wallet address to query.'),
            network: z.enum(['bnb', 'solana', 'ethereum']).optional().default("bnb").describe('The blockchain network to query the wallet on.'),
           
        }),
        handler: ({ address, network }: { address: string, network?: string}) => {
            if (!address) {
                throw new McpError(ErrorCode.InvalidParams, "Please provide a wallet address");
            }
            return {
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `I want to get the balance of ${address} on ${network}.`
                    }
                }]
            }
        }
    },

    {
        name: 'get-token-info',
        description: 'Get information of a token',
        arguments: z.object({
            query: z.string().describe('The token address or symbol to query'),
            network: z
              .enum(['bnb', 'solana', 'ethereum'])
              .default('bnb')
              .describe('The blockchain network to query the token on'),
            includePrice: z
              .boolean()
              .optional()
              .default(true)
              .describe('Whether to include price information in the response'),
          }),
        handler: ({query, network, includePrice }: { query: string, network?: string, includePrice?: boolean}) => {
            if (!query) {
                throw new McpError(ErrorCode.InvalidParams, "Please provide a token address or symbol");
            }
            return {
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `I want to get the token info of ${query} on ${network}.`
                    }
                }]
            }
        }
    }
];
