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