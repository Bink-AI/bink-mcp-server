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
            output_wallet_address: z.string().describe('The recipient contract address'),
            amount_transfer: z.string().describe('The amount of tokens to transfer'),
            network: z
              .enum(['bnb','solana', 'ethereum'])
              .default('bnb')
              .describe('The blockchain network to transfer on'),
          }),
        handler: ({ token, output_wallet_address, amount_transfer, network }: { token: string, output_wallet_address: string, amount_transfer: string, network: string }) => {
            if (!token || !output_wallet_address || !amount_transfer) {
                throw new McpError(ErrorCode.InvalidParams, "Please provide a token address, recipient contract address, and amount token");
            }
            return {
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `I want to transfer ${amount_transfer} ${token} to ${output_wallet_address} on ${network}.`
                    }
                }]
            }
        }
    },
    {
        name: 'staking-token',
        description: 'Stake and unstake tokens from your wallet using Venus provider',
        arguments: z.object({
            input_token_address: z.string().describe('The input token address stake or unstake'),
            input_token_amount: z.string().describe('The amount of token to stake or unstake'),
        }),
        handler: ({ input_token_address, input_token_amount }: { input_token_address: string, input_token_amount: string }) => {
            if (!input_token_address ||!input_token_amount) {
                throw new McpError(ErrorCode.InvalidParams, "Please provide a token address and amount for stake or unstake");
            }
            return {
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `I want to stake/unstake ${input_token_amount} ${input_token_address}.`
                    }
                }]
            }
        }
    },
    {
        name: 'bridge-token',
        description: 'Bridge or swap crosschain tokens from one blockchain to another',
        arguments: z.object({
            input_network: z
              .enum(['bnb','solana', 'ethereum'])
              .describe('The blockchain network to execute the bridge from'),
            output_network: z
              .enum(['bnb','solana', 'ethereum'])
              .describe(
                'The blockchain network to execute the bridge to or on symbor native token. Example: Solana similar SOL or on BNB',
              ),
            input_token_address: z.string().describe('The address of send token'),
            ouput_token_address: z.string().describe(`The address of receive token`),
            amount: z.string().describe('The amount of tokens to bridge'),
          }),
        handler: ({ input_network, output_network, input_token_address, ouput_token_address, amount }: { input_network: string, output_network: string, input_token_address: string, ouput_token_address: string, amount: string }) => {
            if (!input_token_address ||!ouput_token_address ||!amount) {
                throw new McpError(ErrorCode.InvalidParams, "Please provide a token address and amount");
            }
            return {
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `I want to  bridge ${amount} ${input_token_address} on ${input_network} to ${ouput_token_address} on ${output_network}.`
                    }
                }]
            }
        }
    },
    {
        name: 'get-balance',
        description: 'Get the balance of my wallet',
        handler: () => {
            return {
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `I want to get the balance of my wallet.`
                    }
                }]
            }
        }
    },
    {
        name: 'get-token-info',
        description: 'Get information of a token',
        arguments: z.object({
            token_address: z.string().describe('The token address or symbol to query'),
            network: z
             .enum(['bnb','solana', 'ethereum'])
             .default('bnb')
             .describe('The blockchain network to execute the bridge from'),
          }),
        handler: ({token_address, network}: { token_address: string, network?: string}) => {
            if (!token_address) {
                throw new McpError(ErrorCode.InvalidParams, "Please provide a token address or network");
            }
            return {
                messages: [{
                    role: "user",
                    content: {
                        type: "text",
                        text: `I want to get the token info of ${token_address} on ${network}.`
                    }
                }]
            }
        }
    }
    
];
