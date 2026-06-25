import * as vscode from 'vscode';

export interface CommitBotConfig {
  apiKey: string;
  model: string;
  apiEndpoint: string;
  language: string;
  maxDiffSize: number;
  customPrompt: string;
}

export function getConfig(): CommitBotConfig {
  const config = vscode.workspace.getConfiguration('commitBot');
  return {
    apiKey: config.get<string>('apiKey') || '',
    model: config.get<string>('model') || 'deepseek-chat',
    apiEndpoint: config.get<string>('apiEndpoint') || 'https://api.deepseek.com/v1',
    language: config.get<string>('language') || 'zh-CN',
    maxDiffSize: config.get<number>('maxDiffSize') || 10000,
    customPrompt: config.get<string>('customPrompt') || '',
  };
}
