import { getWorkspacePath } from "../tauri";
import type { AcpTransport } from "./transport";

/**
 * ACP session bootstrap and React Suspense resource identity.
 */
export class AcpSession {
  private sessionReady: Promise<string> | null = null;
  /** Stable promise identity for React `use()` / Suspense across remounts. */
  private sessionResource: Promise<string> | null = null;
  private sessionId: string | null = null;

  constructor(private readonly transport: AcpTransport) {
    this.transport.setBridgeFailedHandler(() => this.clear());
  }

  clear(): void {
    this.sessionId = null;
    this.sessionReady = null;
    this.sessionResource = null;
  }

  /**
   * React resource for `use()` / Suspense. Safe during render: always returns the
   * same in-flight or settled promise so remounts do not start overlapping bootstraps.
   */
  getSessionResource(): Promise<string> {
    if (!this.sessionResource) {
      this.sessionResource = this.ensureSession();
    }
    return this.sessionResource;
  }

  /**
   * Shared session bootstrap. Concurrent callers share one promise (`sessionReady`);
   * prefer `getSessionResource()` from React render for stable Suspense identity.
   */
  ensureSession(): Promise<string> {
    if (this.sessionId) {
      return (this.sessionResource ??= Promise.resolve(this.sessionId));
    }
    if (this.sessionReady) return this.sessionReady;

    const bootstrap = (async () => {
      await this.transport.attach();
      if (this.transport.bridgeError) throw this.transport.bridgeError;

      if (!this.transport.isInitialized) {
        await this.transport.request("initialize", {
          protocolVersion: 1,
          clientCapabilities: {},
          clientInfo: {
            name: "reading-supporter",
            title: "Reading Supporter",
            version: "0.1.0",
          },
        });
        this.transport.markInitialized();
      }

      if (!this.sessionId) {
        const cwd = await getWorkspacePath();
        const response = await this.transport.request("session/new", {
          cwd,
          mcpServers: [],
        });
        const sessionId = (response.result as { sessionId?: string } | undefined)?.sessionId;
        if (!sessionId) throw new Error("OpenCode did not return a session id.");
        this.sessionId = sessionId;
      }

      return this.sessionId;
    })();

    this.sessionReady = bootstrap;
    void bootstrap.catch(() => {
      if (this.sessionReady === bootstrap) {
        this.sessionReady = null;
      }
      this.transport.resetInitialized();
      this.sessionId = null;
    });

    return bootstrap;
  }
}
