# Commit Bot

[![Marketplace](https://img.shields.io/visual-studio-marketplace/v/leocat81.commit-bot)](https://marketplace.visualstudio.com/items?itemName=leocat81.commit-bot)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/leocat81.commit-bot)](https://marketplace.visualstudio.com/items?itemName=leocat81.commit-bot)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

AI-powered Git commit message generator using DeepSeek.

Commit Bot reads your current changes, asks your configured LLM for a
[Conventional Commits](https://www.conventionalcommits.org/) message, and
writes it directly into the Source Control commit box.

## Features

- One-click generation from the Source Control title bar
- Conventional Commits output (`feat:`, `fix:`, `docs:`, ...)
- Staged, unstaged and untracked changes are all considered
- Configurable model, API endpoint, output language and prompt
- Works with any OpenAI-compatible chat completions endpoint

## Requirements

- VS Code 1.85.0 or higher
- A DeepSeek API key (or any OpenAI-compatible API key)

## Installation

Install from the
[Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=leocat81.commit-bot),
or from the command line:

```bash
code --install-extension leocat81.commit-bot
```

Then set your API key in Settings under `commitBot.apiKey`.

## Usage

1. Make changes in a Git repository and stage what you want to commit.
2. Open the Source Control view.
3. Click the sparkle icon in the title bar, or run
   **Commit Bot: Generate Commit Message** from the Command Palette.
4. Review the generated message in the commit box and commit.

## Configuration

| Setting | Default | Description |
| --- | --- | --- |
| `commitBot.apiKey` | `""` | API key for your LLM provider (required) |
| `commitBot.model` | `deepseek-chat` | Model name |
| `commitBot.apiEndpoint` | `https://api.deepseek.com/v1` | OpenAI-compatible base URL |
| `commitBot.language` | `zh-CN` | Language of the generated message |
| `commitBot.maxDiffSize` | `10000` | Maximum diff size in characters |
| `commitBot.customPrompt` | `""` | Optional custom prompt template |

## Privacy

Commit Bot sends your git diff to the API endpoint you configure (default:
`https://api.deepseek.com/v1`) solely to generate a commit message. No data is
stored by the extension, and nothing is sent anywhere else.

Your API key is stored in VS Code `settings.json` in plain text. If Settings
Sync is enabled, VS Code may sync the key to your other devices. To mitigate
this risk:

- use a dedicated, revocable API key
- add `commitBot.apiKey` to `settingsSync.ignoredSettings`, for example:

  ```json
  {
    "settingsSync.ignoredSettings": ["commitBot.apiKey"]
  }
  ```

- never commit or share your `settings.json`

## Development

```bash
npm install
npm run compile   # build once into out/
npm run watch     # incremental build
npm run package   # build a .vsix
```

Press `F5` in VS Code to launch an Extension Development Host.

## License

[MIT](LICENSE)
