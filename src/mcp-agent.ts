import { BaseAgent, DatabaseAdapter, IPlugin, IWallet, NetworksConfig } from "@binkai/core";
import {
    Tool
} from "@modelcontextprotocol/sdk/types.js";
import { convertToOpenAITool } from '@langchain/core/utils/function_calling';

export class MCPAgent extends BaseAgent {
    private wallet: IWallet;
    private networks: NetworksConfig['networks'];
    constructor(wallet: IWallet, networks: NetworksConfig['networks']) {
        super();
        this.wallet = wallet;
        this.networks = networks;
    }
    protected onToolsUpdated(): Promise<void> {
        return Promise.resolve();
    }

    async registerPlugin(plugin: IPlugin): Promise<void> {
        const pluginName = plugin.getName();
        this.plugins.set(pluginName, plugin);

        // Register all tools from the plugin
        const tools = plugin.getTools();
        for (const tool of tools) {
            await this.registerTool(tool);
        }
    }

    isMockResponseTool(): boolean {
        return false;
    }
    execute(params: unknown, onStream?: unknown): Promise<string> | Promise<any> {
        throw new Error("Not supported");
    }
    public getWallet(): IWallet {
        return this.wallet;
    }

    public getNetworks(): NetworksConfig['networks'] {
        return this.networks;
    }

    public getMcpTools(): Tool[] {
        const tools = this.getTools();
        return tools.map((tool) => {
            const func = convertToOpenAITool(tool);
            return {
                name: tool.name,
                description: tool.description,
                inputSchema: func.function.parameters,
            } as Tool;
        });
    }

    registerDatabase(db: DatabaseAdapter): Promise<void> {
        throw new Error("Method not implemented.");
    }

}