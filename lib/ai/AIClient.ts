import type { LanguageModelV1, LanguageModelV1StreamPart } from 'ai';

type LanguageModelV1TextPart = {
  type: 'text';
  text: string;
};

async function fetchStream(
  url: string,
  data: any,
): Promise<ReadableStream<LanguageModelV1StreamPart>> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.body) {
    throw new Error('Response body is null');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream<LanguageModelV1StreamPart>({
    async pull(controller) {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          controller.close();
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log(chunk);
        try {
          controller.enqueue({
            type: 'text-delta',
            textDelta: chunk ,
          });
        
        } catch (err) {
          console.error('Error parsing stream chunk:', err);
        }

      }
    },
  });
}

async function fetchResponse(url: string, data: any): Promise<string> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.body) {
    throw new Error('Response body is null');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let resultText = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    resultText += decoder.decode(value, { stream: true });
  }

  return resultText;
}

class AIClient implements LanguageModelV1 {
  readonly specificationVersion = 'v1';
  readonly url: string =
    process.env.AI_API_URL || 'http://localhost:8000/stream';
  readonly provider: LanguageModelV1['provider'];
  readonly modelId: LanguageModelV1['modelId'];
  supportsUrl: LanguageModelV1['supportsUrl'];
  doGenerate: LanguageModelV1['doGenerate'];
  doStream: LanguageModelV1['doStream'];
  readonly defaultObjectGenerationMode: LanguageModelV1['defaultObjectGenerationMode'];
  readonly supportsStructuredOutputs: LanguageModelV1['supportsStructuredOutputs'];

  constructor({
    provider,
    modelId,
    supportsUrl,
    defaultObjectGenerationMode,
    supportsStructuredOutputs,
  }: {
    provider?: LanguageModelV1['provider'];
    modelId?: LanguageModelV1['modelId'];
    supportsUrl?: LanguageModelV1['supportsUrl'];
    doGenerate?: LanguageModelV1['doGenerate'];
    defaultObjectGenerationMode?: LanguageModelV1['defaultObjectGenerationMode'];
    supportsStructuredOutputs?: LanguageModelV1['supportsStructuredOutputs'];
  } = {}) {
    this.provider = provider || 'default-provider';
    this.modelId = modelId || 'default-model';
    this.supportsUrl = supportsUrl;
    this.doGenerate = async ({ inputFormat, prompt }) => {
      const resultText = await fetchResponse(this.url, { prompt: prompt });

      return {
        text: resultText,
        finishReason: 'stop',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
        },
        rawCall: { rawPrompt: prompt, rawSettings: {} },
      };
    };
    this.doStream = async ({ inputFormat, prompt }) => {
      return {
        stream: await fetchStream(this.url, { prompt: prompt }),
        rawCall: {
          rawPrompt: prompt,
          rawSettings: {},
        },
      };
    };
    this.defaultObjectGenerationMode = defaultObjectGenerationMode;
    this.supportsStructuredOutputs = supportsStructuredOutputs;
  }
}

export { AIClient };
