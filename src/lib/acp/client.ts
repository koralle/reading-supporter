import { AcpPromptRunner } from "./prompt";
import { AcpSession } from "./session";
import { AcpTransport } from "./transport";

/**
 * Minimal public ACP client: session resource for Suspense + streaming prompts.
 */
export class AcpClient {
  private readonly transport = new AcpTransport();
  private readonly session = new AcpSession(this.transport);
  private readonly prompts = new AcpPromptRunner(this.transport, this.session);

  getSessionResource(): Promise<string> {
    return this.session.getSessionResource();
  }

  prompt(question: string, signal: AbortSignal): AsyncGenerator<string> {
    return this.prompts.prompt(question, signal);
  }
}

export const acpClient = new AcpClient();
