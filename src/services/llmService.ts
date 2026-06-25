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