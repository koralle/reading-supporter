import { asError } from "./types";
import type { AcpSession } from "./session";
import type { AcpTransport } from "./transport";

/**
 * Prompt streaming orchestration: serializes prompts and yields cumulative text chunks.
 */
export class AcpPromptRunner {
  private promptTail: Promise<void> = Promise.resolve();

  constructor(
    private readonly transport: AcpTransport,
    private readonly session: AcpSession,
  ) {}

  async *prompt(question: string, signal: AbortSignal): AsyncGenerator<string> {
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const previous = this.promptTail;
    this.promptTail = previous.then(() => gate);
    await previous;

    try {
      if (!this.transport.bridgeAlive) {
        throw this.transport.bridgeError ?? new Error("OpenCode is not running.");
      }

      const sessionId = await this.session.ensureSession();
      const chunks: string[] = [];
      let wake: (() => void) | null = null;
      let finished = false;
      let requestError: Error | null = null;
      let fullText = "";

      const listener = (text: string) => {
        chunks.push(text);
        wake?.();
        wake = null;
      };
      this.transport.addUpdateListener(listener);

      const requestPromise = this.transport.request("session/prompt", {
        sessionId,
        prompt: [{ type: "text", text: question }],
      });
      requestPromise.then(
        () => {
          finished = true;
          wake?.();
          wake = null;
        },
        (error) => {
          requestError = asError(error);
          finished = true;
          wake?.();
          wake = null;
        },
      );

      const abort = () => {
        void this.transport.notify("session/cancel", { sessionId });
        finished = true;
        wake?.();
        wake = null;
      };
      signal.addEventListener("abort", abort, { once: true });

      try {
        while (!finished || chunks.length > 0) {
          if (signal.aborted) throw new DOMException("The request was cancelled.", "AbortError");
          if (!this.transport.bridgeAlive) {
            throw (
              this.transport.bridgeError ??
              new Error("OpenCode exited while waiting for a response.")
            );
          }
          if (chunks.length === 0) {
            await new Promise<void>((resolve) => {
              wake = resolve;
            });
            continue;
          }
          fullText += chunks.shift();
          yield fullText;
        }
        if (requestError) throw requestError;
      } finally {
        signal.removeEventListener("abort", abort);
        this.transport.removeUpdateListener(listener);
      }
    } finally {
      release();
    }
  }
}
