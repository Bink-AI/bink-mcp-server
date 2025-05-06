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
    }
];
