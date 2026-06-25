import * as vscode from 'vscode';
import { getConfig } from '../types/config';
import { getDiff, getRepository } from '../services/gitService';
import { generateCommitMessage } from '../services/llmService';

export async function generateCommit(): Promise<void> {
  const config = getConfig();
  
  if (!config.apiKey) {
    const action = await vscode.window.showErrorMessage(
      'DeepSeek API Key not configured. Please add it in settings.',
      'Open Settings'
    );
    if (action === 'Open Settings') {
      vscode.commands.executeCommand('workbench.action.openSettings', 'commitBot.apiKey');
    }
    return;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.SourceControl,
      title: 'Generating commit message...',
      cancellable: false,
    },
    async () => {
      try {
        const diff = await getDiff();
        
        if (diff.length > config.maxDiffSize) {
          const truncatedDiff = diff.substring(0, config.maxDiffSize);
          vscode.window.showWarningMessage(
            `Diff is large (${diff.length} chars), truncated to ${config.maxDiffSize} chars`
          );
          const commitMessage = await generateCommitMessage(truncatedDiff, config);
          await setCommitMessage(commitMessage);
        } else {
          const commitMessage = await generateCommitMessage(diff, config);
          await setCommitMessage(commitMessage);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Failed to generate commit message: ${message}`);
      }
    }
  );
}

async function setCommitMessage(message: string): Promise<void> {
  const repository = await getRepository();
  if (repository && repository.inputBox) {
    repository.inputBox.value = message;
    vscode.window.showInformationMessage('Commit message generated successfully!');
  } else {
    vscode.window.showErrorMessage('Could not access Git input box');
  }
}
