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

export async function getDiff(): Promise<string> {
  const repository = getGitRepository();
  
  const stagedDiff = await repository.diff(true);
  if (stagedDiff && stagedDiff.trim().length > 0) {
    return stagedDiff;
  }
  
  const unstagedDiff = await repository.diff(false);
  if (unstagedDiff && unstagedDiff.trim().length > 0) {
    return unstagedDiff;
  }
  
  const untrackedDiff = await getUntrackedDiff(repository);
  if (untrackedDiff && untrackedDiff.trim().length > 0) {
    return untrackedDiff;
  }
  
  throw new Error('No changes found. Please modify some files first.');
}

async function getUntrackedDiff(repository: any): Promise<string> {
  const changes = repository.state.workingTreeChanges || [];
  const untracked = changes.filter((c: any) => c.status === 'untracked');
  
  if (untracked.length === 0) {
    return '';
  }
  
  const diffs: string[] = [];
  for (const change of untracked) {
    try {
      const uri = change.uri;
      const doc = await vscode.workspace.openTextDocument(uri);
      const content = doc.getText();
      const fileName = uri.path.split('/').pop() || uri.path;
      diffs.push(`diff --git a/${fileName} b/${fileName}\nnew file mode 100000\n--- /dev/null\n+++ b/${fileName}\n${content.split('\n').map((line: string) => '+' + line).join('\n')}`);
    } catch {
      continue;
    }
  }
  
  return diffs.join('\n');
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
