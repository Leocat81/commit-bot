# Commit Bot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a VSCode extension that generates Git commit messages using DeepSeek LLM.

**Architecture:** Lightweight TypeScript extension using VSCode Git API and OpenAI-compatible DeepSeek API. Single-click UI in Source Control panel triggers diff analysis and commit message generation.

**Tech Stack:** TypeScript 5.x, VSCode Extension API, DeepSeek API (OpenAI compatible)

---

## Task 1: Initialize Project Structure

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.vscodeignore`
- Create: `.gitignore`

**Step 1: Create package.json**

```json
{
  "name": "commit-bot",
  "displayName": "Commit Bot",
  "description": "AI-powered Git commit message generator using DeepSeek",
  "version": "0.0.1",
  "publisher": "commit-bot",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "onCommand:commitBot.generate"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "commitBot.generate",
        "title": "Generate Commit Message",
        "icon": "$(sparkle)"
      }
    ],
    "menus": {
      "scm/title": [
        {
          "command": "commitBot.generate",
          "group": "navigation",
          "when": "scmProvider == git"
        }
      ]
    },
    "configuration": {
      "title": "Commit Bot",
      "properties": {
        "commitBot.apiKey": {
          "type": "string",
          "default": "",
          "description": "DeepSeek API Key"
        },
        "commitBot.model": {
          "type": "string",
          "default": "deepseek-chat",
          "description": "Model name to use"
        },
        "commitBot.apiEndpoint": {
          "type": "string",
          "default": "https://api.deepseek.com/v1",
          "description": "API endpoint URL"
        },
        "commitBot.language": {
          "type": "string",
          "default": "zh-CN",
          "description": "Output language for commit messages"
        },
        "commitBot.maxDiffSize": {
          "type": "number",
          "default": 10000,
          "description": "Maximum diff size in characters"
        },
        "commitBot.customPrompt": {
          "type": "string",
          "default": "",
          "description": "Custom prompt template (leave empty for default)"
        }
      }
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "lint": "eslint src --ext ts"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/vscode": "^1.85.0",
    "@typescript-eslint/eslint-plugin": "^6.13.0",
    "@typescript-eslint/parser": "^6.13.0",
    "eslint": "^8.54.0",
    "typescript": "^5.3.2"
  }
}
```

**Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2021",
    "lib": ["ES2021"],
    "outDir": "out",
    "rootDir": "src",
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "exclude": ["node_modules", ".vscode-test"]
}
```

**Step 3: Create .vscodeignore**

```
.vscode/**
.vscode-test/**
src/**
.gitignore
.yarnrc
vsc-extension-quickstart.md
**/tsconfig.json
**/.eslintrc.json
**/*.map
**/*.ts
```

**Step 4: Create .gitignore**

```
out
node_modules
.vscode-test/
*.vsix
```

**Step 5: Install dependencies**

Run: `npm install`
Expected: node_modules created with dependencies

**Step 6: Commit**

```bash
git add package.json tsconfig.json .vscodeignore .gitignore
git commit -m "chore: initialize project structure"
```

---

## Task 2: Create Configuration Types

**Files:**
- Create: `src/types/config.ts`

**Step 1: Create config types**

```typescript
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
```

**Step 2: Add vscode import**

```typescript
import * as vscode from 'vscode';

export interface CommitBotConfig {
  // ... rest of the file
```

**Step 3: Compile to verify**

Run: `npm run compile`
Expected: No errors, out/types/config.js created

**Step 4: Commit**

```bash
git add src/types/config.ts
git commit -m "feat: add configuration types"
```

---

## Task 3: Create Git Service

**Files:**
- Create: `src/services/gitService.ts`

**Step 1: Create git service**

```typescript
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
```

**Step 2: Compile to verify**

Run: `npm run compile`
Expected: No errors, out/services/gitService.js created

**Step 3: Commit**

```bash
git add src/services/gitService.ts
git commit -m "feat: add git service for diff retrieval"
```

---

## Task 4: Create Prompt Builder

**Files:**
- Create: `src/utils/promptBuilder.ts`

**Step 1: Create prompt builder**

```typescript
import { CommitBotConfig } from '../types/config';

const DEFAULT_PROMPT = `你是一个专业的 Git 提交信息生成助手。

请根据以下代码变更，生成一个符合 Conventional Commits 规范的中文提交信息。

格式要求：
- type(scope): subject
- type: feat|fix|docs|style|refactor|test|chore
- scope: 可选，表示影响范围
- subject: 简短描述，不超过50字符

代码变更：
{diff}

只输出 commit message，不要其他内容。`;

export function buildPrompt(diff: string, config: CommitBotConfig): string {
  const template = config.customPrompt || DEFAULT_PROMPT;
  return template.replace('{diff}', diff);
}

export function parseCommitMessage(response: string): string {
  const lines = response.trim().split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('//')) {
      return trimmed;
    }
  }
  return response.trim();
}
```

**Step 2: Compile to verify**

Run: `npm run compile`
Expected: No errors, out/utils/promptBuilder.js created

**Step 3: Commit**

```bash
git add src/utils/promptBuilder.ts
git commit -m "feat: add prompt builder utility"
```

---

## Task 5: Create LLM Service

**Files:**
- Create: `src/services/llmService.ts`

**Step 1: Create LLM service**

```typescript
import * as https from 'https';
import { CommitBotConfig } from '../types/config';
import { buildPrompt, parseCommitMessage } from '../utils/promptBuilder';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

function makeRequest(
  url: string,
  options: https.RequestOptions,
  body?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

export async function generateCommitMessage(
  diff: string,
  config: CommitBotConfig,
  abortSignal?: AbortSignal
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('API Key not configured. Please set commitBot.apiKey in settings.');
  }

  const prompt = buildPrompt(diff, config);
  
  const requestBody: ChatCompletionRequest = {
    model: config.model,
    messages: [
      {
        role: 'system',
        content: '你是一个专业的 Git 提交信息生成助手。请严格按照 Conventional Commits 规范生成提交信息。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 500,
  };

  const url = `${config.apiEndpoint}/chat/completions`;
  const bodyString = JSON.stringify(requestBody);

  const options: https.RequestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Length': Buffer.byteLength(bodyString),
    },
  };

  if (abortSignal?.aborted) {
    throw new Error('Request cancelled');
  }

  const response = await makeRequest(url, options, bodyString);
  const parsed: ChatCompletionResponse = JSON.parse(response);
  
  if (!parsed.choices || parsed.choices.length === 0) {
    throw new Error('No response from LLM');
  }

  const rawMessage = parsed.choices[0].message.content;
  return parseCommitMessage(rawMessage);
}
```

**Step 2: Compile to verify**

Run: `npm run compile`
Expected: No errors, out/services/llmService.js created

**Step 3: Commit**

```bash
git add src/services/llmService.ts
git commit -m "feat: add LLM service for DeepSeek API calls"
```

---

## Task 6: Create Main Command

**Files:**
- Create: `src/commands/generateCommit.ts`

**Step 1: Create generate command**

```typescript
import * as vscode from 'vscode';
import { getConfig } from '../types/config';
import { getStagedDiff, getRepository } from '../services/gitService';
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
        const diff = await getStagedDiff();
        
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
```

**Step 2: Compile to verify**

Run: `npm run compile`
Expected: No errors, out/commands/generateCommit.js created

**Step 3: Commit**

```bash
git add src/commands/generateCommit.ts
git commit -m "feat: add generate commit command"
```

---

## Task 7: Create Extension Entry Point

**Files:**
- Create: `src/extension.ts`

**Step 1: Create extension entry**

```typescript
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
```

**Step 2: Compile to verify**

Run: `npm run compile`
Expected: No errors, out/extension.js created

**Step 3: Commit**

```bash
git add src/extension.ts
git commit -m "feat: add extension entry point"
```

---

## Task 8: Create README

**Files:**
- Create: `README.md`

**Step 1: Create README**

```markdown
# Commit Bot

AI-powered Git commit message generator using DeepSeek LLM.

## Features

- 🚀 One-click commit message generation from Source Control panel
- 🎯 Conventional Commits format support
- 🇨🇳 Chinese language output
- ⚡ Fast and lightweight

## Requirements

- VSCode 1.85.0 or higher
- DeepSeek API Key

## Installation

1. Install the extension
2. Configure your DeepSeek API Key in VSCode settings

## Configuration

Open VSCode settings and configure:

- `commitBot.apiKey`: Your DeepSeek API Key (required)
- `commitBot.model`: Model name (default: `deepseek-chat`)
- `commitBot.apiEndpoint`: API endpoint (default: `https://api.deepseek.com/v1`)
- `commitBot.language`: Output language (default: `zh-CN`)
- `commitBot.maxDiffSize`: Max diff size in characters (default: `10000`)
- `commitBot.customPrompt`: Custom prompt template (optional)

## Usage

1. Stage your changes in the Source Control panel
2. Click the ✨ icon in the Source Control title bar
3. Wait for the commit message to be generated
4. Review and adjust if needed
5. Commit!

## License

MIT
```

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README"
```

---

## Task 9: Final Testing

**Step 1: Compile the extension**

Run: `npm run compile`
Expected: No errors

**Step 2: Package the extension (optional)**

Run: `npx @vscode/vsce package`
Expected: commit-bot-0.0.1.vsix created

**Step 3: Test in VSCode**

1. Open VSCode
2. Press F5 to launch Extension Development Host
3. Open a Git repository
4. Stage some changes
5. Click the ✨ icon in Source Control panel
6. Verify commit message appears in input box

**Step 4: Final commit**

```bash
git add .
git commit -m "chore: finalize implementation"
```

---

## Summary

Total: 9 tasks with incremental commits

- Task 1: Project initialization
- Task 2: Configuration types
- Task 3: Git service
- Task 4: Prompt builder
- Task 5: LLM service
- Task 6: Main command
- Task 7: Extension entry
- Task 8: README
- Task 9: Final testing