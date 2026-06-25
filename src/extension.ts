import * as vscode from 'vscode';
import { generateCommit } from './commands/generateCommit';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'commitBot.generate',
    generateCommit
  );
  
  context.subscriptions.push(disposable);
}

export function deactivate() {}
