# Commit Bot - VSCode Git Commit Message Generator

## Overview

A lightweight VSCode extension that leverages DeepSeek LLM to automatically generate conventional commit messages based on staged git changes.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  VSCode Extension                    │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │
│  │   UI Layer   │  │  Core Logic  │  │   Config  │ │
│  │  - Status    │  │  - Git Diff  │  │  - API    │ │
│  │    Bar Icon  │  │  - LLM Call  │  │    Key    │ │
│  │  - Context   │  │  - Message   │  │  - Model  │ │
│  │    Menu      │  │    Generator │  │  - Prompt │ │
│  └──────────────┘  └──────────────┘  └───────────┘ │
├─────────────────────────────────────────────────────┤
│                    Dependencies                      │
│  - VSCode Git API (built-in)                        │
│  - DeepSeek API (OpenAI compatible)                 │
└─────────────────────────────────────────────────────┘
```

### Core Modules

- **UI Layer**: Source Control panel icon, context menu integration
- **Core Logic**: Git diff retrieval, LLM invocation, message generation
- **Config**: API Key, model selection, prompt templates

## Data Flow

```
User clicks icon
    │
    ▼
┌─────────────────┐
│ Get Git Diff    │ ← VSCode Git API
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Check Diff Size │ ← Warn if exceeds threshold
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Build Prompt    │ ← System prompt + Diff content
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Call DeepSeek   │ ← API call (with loading state)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Parse Response  │ ← Extract commit message
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Fill Input Box  │ ← VSCode Git API
└─────────────────┘
```

## UI Design

### Source Control Panel Icon

- Location: SCM Title area
- Icon: ✨ (sparkle)
- Behavior: Click to trigger commit message generation
- Loading state: Icon shows spinner animation during API call

### VSCode Settings

| Configuration | Type | Default | Description |
|---------------|------|---------|-------------|
| `commitBot.apiKey` | string | `""` | DeepSeek API Key |
| `commitBot.model` | string | `"deepseek-chat"` | Model name |
| `commitBot.apiEndpoint` | string | `"https://api.deepseek.com/v1"` | API endpoint |
| `commitBot.language` | string | `"zh-CN"` | Output language |
| `commitBot.maxDiffSize` | number | `10000` | Max diff characters |
| `commitBot.customPrompt` | string | `""` | Custom prompt template |

## Project Structure

```
commit-bot/
├── src/
│   ├── extension.ts          # Extension entry point
│   ├── commands/
│   │   └── generateCommit.ts # Main generation logic
│   ├── services/
│   │   ├── gitService.ts     # Git diff retrieval
│   │   └── llmService.ts     # DeepSeek API calls
│   ├── utils/
│   │   └── promptBuilder.ts  # Prompt template builder
│   └── types/
│       └── config.ts         # Configuration types
├── package.json              # Extension metadata
├── tsconfig.json             # TypeScript config
└── README.md                 # Usage documentation
```

## Prompt Template

```
你是一个专业的 Git 提交信息生成助手。

请根据以下代码变更，生成一个符合 Conventional Commits 规范的中文提交信息。

格式要求：
- type(scope): subject
- type: feat|fix|docs|style|refactor|test|chore
- scope: 可选，表示影响范围
- subject: 简短描述，不超过50字符

代码变更：
${diff}

只输出 commit message，不要其他内容。
```

## Error Handling

| Scenario | Handling |
|----------|----------|
| No Git repository | Alert: "Please open a Git repository" |
| No staged changes | Alert: "No staged changes, please stage files first" |
| Invalid API Key | Alert: "Invalid API Key, please check configuration" |
| Network timeout | 30s timeout, show network error |
| Empty diff | Alert: "No code changes detected" |
| Malformed LLM response | Regex extraction, fallback to raw output |
| Large diff | Warning + truncation |

## Performance Considerations

- Use `AbortController` for request cancellation
- Truncate large diffs to threshold limit
- Optional streaming response (future enhancement)

## Technology Stack

- TypeScript 5.x
- VSCode Extension API
- Built-in `https` module (no external HTTP libraries)

## Success Criteria

1. One-click commit message generation from Source Control panel
2. Accurate Conventional Commits format output
3. Chinese language support
4. Graceful error handling with user-friendly messages
5. Minimal extension size (< 100KB)
