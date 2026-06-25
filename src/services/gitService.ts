import * as vscode from 'vscode';

export async function getStagedDiff(): Promise<string> {
  const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
  if (!gitExtension) {
    throw new Error('Git extension not found');
  }

  const git = gitExtension.getAPI(1);
  const repository = git.repositories[0];
  
  if (!repository) {
    throw new Error('No Git repository found');
  }

  const diff = await repository.diff(true);
  
  if (!diff || diff.trim().length === 0) {
    throw new Error('No staged changes found. Please stage some files first.');
  }

  return diff;
}

export async function getRepository(): Promise<any> {
  const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
  if (!gitExtension) {
    throw new Error('Git extension not found');
  }

  const git = gitExtension.getAPI(1);
  const repository = git.repositories[0];
  
  if (!repository) {
    throw new Error('No Git repository found');
  }

  return repository;
}
