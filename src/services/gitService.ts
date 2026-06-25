import * as vscode from 'vscode';

/**
 * Git API types from VSCode's built-in Git extension.
 * Using 'any' since these types are not easily importable from the extension API.
 */
type GitExtensionAPI = any;
type GitRepository = any;

/**
 * Gets the active Git repository.
 * 
 * NOTE: Currently only supports single-root workspaces (uses repositories[0]).
 * Multi-root workspace support would require workspace folder selection logic.
 */
function getGitRepository(): GitRepository {
  const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports as GitExtensionAPI;
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

export async function getStagedDiff(): Promise<string> {
  const repository = getGitRepository();
  const diff = await repository.diff(true);
  
  if (!diff || diff.trim().length === 0) {
    throw new Error('No staged changes found. Please stage some files first.');
  }

  return diff;
}

export async function getRepository(): Promise<GitRepository> {
  return getGitRepository();
}
