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