import { ItemView, WorkspaceLeaf } from 'obsidian';
import * as React from 'react';
import { Root, createRoot } from 'react-dom/client';
import PluginView from './PluginView';
import { App } from 'obsidian';
import Intelligence from '../../main';
import OpenAI from 'openai';

export const INTELLIGENCE_VIEW_TYPE = 'intelligence-view';



export const AppContext = React.createContext<App | undefined>(undefined);

export const PluginContext = React.createContext<
    Intelligence | undefined
>(undefined);

export const OpenAIContext = React.createContext<OpenAI | undefined>(undefined);

// export const CommandsContext = React.createContext<ICommandPayload | undefined>(undefined);

export const useApp = (): App | undefined => {
    return React.useContext(AppContext);
};

export const usePlugin = (): Intelligence | undefined => {
    return React.useContext(PluginContext);
};

export const useOpenAI = (): OpenAI | undefined => {
    return React.useContext(OpenAIContext);
};

// export const useCommands = (): ICommandPayload | undefined => {
//     return React.useContext(CommandsContext);
// };

export class AppView extends ItemView {
    root: Root | null = null;
    plugin: Intelligence;
    openAI: OpenAI;
    // commands: ICommandPayload | undefined;

    constructor(leaf: WorkspaceLeaf, plugin: Intelligence) {
        super(leaf);
        this.plugin = plugin;
        const openaiKey = plugin.settings.openaiKey;
        const openAIInstance = new OpenAI({
            apiKey: openaiKey,
            dangerouslyAllowBrowser: true,
        });
        this.openAI = openAIInstance;
        // this.addCommands();
    }

    getViewType() {
        return INTELLIGENCE_VIEW_TYPE;
    }

    getDisplayText() {
        return 'Intelligence';
    }
    getIcon(): string {
        return 'bot';
    }

    async onOpen() {
        this.root = createRoot(this.containerEl.children[1]);
        this.root.render(
            <AppContext.Provider value={this.app}>
                <PluginContext.Provider value={this.plugin}>
                    <OpenAIContext.Provider value={this.openAI}>
                        {/* <CommandsContext.Provider value={this.commands}> */}
                        <PluginView />
                        {/* </CommandsContext.Provider> */}
                    </OpenAIContext.Provider>
                </PluginContext.Provider>
            </AppContext.Provider>,
        );
    }
    async onClose() {
        this.root?.unmount();
    }
}
