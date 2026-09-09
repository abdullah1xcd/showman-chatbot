/**
 * n8n Webhook Integration for SHOMAN AI
 * Connects the website chat UI directly to the user's n8n workflow:
 * Website Chat UI -> POST -> n8n Webhook -> AI Agent -> Response -> Website displays reply
 */

export const N8N_ENDPOINTS = {
  test: 'https://abdullahharoon.app.n8n.cloud/webhook-test/shoman-ai',
  production: 'https://abdullahharoon.app.n8n.cloud/webhook/shoman-ai',
} as const;

export type N8nMode = 'test' | 'production';

const N8N_MODE_KEY = 'shoman_ai_n8n_mode';

export function getN8nMode(): N8nMode {
  try {
    const saved = localStorage.getItem(N8N_MODE_KEY);
    if (saved === 'production' || saved === 'test') {
      return saved;
    }
  } catch {
    // ignore
  }
  // Default to test mode as user mentioned they are currently testing with /webhook-test/shoman-ai
  return 'test';
}

export function setN8nMode(mode: N8nMode): void {
  try {
    localStorage.setItem(N8N_MODE_KEY, mode);
  } catch {
    // ignore
  }
}

export interface N8nSendParams {
  message: string;
  language?: string;
  attachment?: string;
  mode?: N8nMode;
  signal?: AbortSignal;
}

export interface N8nResponse {
  reply: string;
  raw?: unknown;
  source: 'n8n' | 'local_fallback';
  isTestMode?: boolean;
}

/**
 * Extracts text from various possible response payloads returned by n8n nodes:
 * e.g., { reply: "..." }, { output: "..." }, { message: "..." }, { text: "..." },
 * or raw array [{ json: { reply: "..." } }] or plain string.
 */
function extractReplyFromData(data: unknown): string | null {
  if (!data) return null;

  if (typeof data === 'string') {
    return data.trim();
  }

  if (Array.isArray(data) && data.length > 0) {
    const first = data[0];
    if (first && typeof first === 'object') {
      if ('json' in first && typeof (first as Record<string, unknown>).json === 'object') {
        return extractReplyFromData((first as Record<string, unknown>).json);
      }
      return extractReplyFromData(first);
    }
    return String(first);
  }

  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>;

    // Common n8n return keys
    if (typeof obj.reply === 'string') return obj.reply;
    if (typeof obj.output === 'string') return obj.output;
    if (typeof obj.message === 'string') return obj.message;
    if (typeof obj.text === 'string') return obj.text;
    if (typeof obj.response === 'string') return obj.response;
    if (typeof obj.answer === 'string') return obj.answer;
    if (typeof obj.result === 'string') return obj.result;
    if (obj.success === false && typeof obj.error === 'string') return obj.error;

    // Check nested response
    if (obj.response && typeof obj.response === 'object') {
      return extractReplyFromData(obj.response);
    }
    if (obj.data && typeof obj.data === 'object') {
      return extractReplyFromData(obj.data);
    }
  }

  return null;
}

/**
 * Sends a message to the n8n webhook
 */
export async function sendN8nWebhook(params: N8nSendParams): Promise<N8nResponse> {
  const mode = params.mode || getN8nMode();
  const endpoint = N8N_ENDPOINTS[mode];

  const payload: Record<string, unknown> = {
    message: params.message,
    language: params.language || 'ar',
  };

  if (params.attachment) {
    payload.attachment = params.attachment;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
    },
    body: JSON.stringify(payload),
    signal: params.signal,
  });

  if (!response.ok) {
    throw new Error(`n8n webhook error: HTTP ${response.status} (${response.statusText})`);
  }

  const contentType = response.headers.get('content-type') || '';
  let extractedReply: string | null = null;
  let rawData: unknown = null;

  if (contentType.includes('application/json')) {
    rawData = await response.json();
    extractedReply = extractReplyFromData(rawData);
  } else {
    const textData = await response.text();
    try {
      rawData = JSON.parse(textData);
      extractedReply = extractReplyFromData(rawData);
    } catch {
      extractedReply = textData;
      rawData = textData;
    }
  }

  if (!extractedReply) {
    extractedReply = typeof rawData === 'string' ? rawData : JSON.stringify(rawData);
  }

  return {
    reply: extractedReply,
    raw: rawData,
    source: 'n8n',
    isTestMode: mode === 'test',
  };
}
