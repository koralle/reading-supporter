import { Channel } from "@tauri-apps/api/core";
import { acpAttach, acpSend, isTauriRuntime } from "../tauri";
import {
  asError,
  hasRequestId,
  type AcpEvent,
  type JsonRpcId,
  type JsonRpcMessage,
  type PendingRequest,
  type UpdateListener,
} from "./types";

/**
 * ACP transport: Channel attach, JSON-RPC request/notify, and inbound event dispatch.
 */
export class AcpTransport {
  private attached = false;
  private attaching: Promise<void> | null = null;
  private nextId = 1;
  private initialized = false;
  bridgeAlive = true;
  bridgeError: Error | null = null;
  private readonly pending = new Map<JsonRpcId, PendingRequest>();
  private readonly listeners = new Set<UpdateListener>();
  private onBridgeFailed: (() => void) | null = null;

  setBridgeFailedHandler(handler: () => void): void {
    this.onBridgeFailed = handler;
  }

  get isInitialized(): boolean {
    return this.initialized;
  }

  markInitialized(): void {
    this.initialized = true;
  }

  resetInitialized(): void {
    this.initialized = false;
  }

  addUpdateListener(listener: UpdateListener): void {
    this.listeners.add(listener);
  }

  removeUpdateListener(listener: UpdateListener): void {
    this.listeners.delete(listener);
  }

  async attach(): Promise<void> {
    if (this.attached) {
      if (this.bridgeError) throw this.bridgeError;
      return;
    }
    if (this.attaching) return this.attaching;
    if (!isTauriRuntime()) {
      throw new Error("The chat bridge is available when the Tauri app is running.");
    }

    this.attaching = (async () => {
      const channel = new Channel<AcpEvent>();
      channel.onmessage = (event) => this.handleEvent(event);
      await acpAttach(channel);
      this.attached = true;
      if (this.bridgeError) throw this.bridgeError;
    })();

    try {
      await this.attaching;
    } finally {
      this.attaching = null;
    }
  }

  failBridge(error: Error): void {
    this.bridgeAlive = false;
    this.bridgeError = error;
    this.initialized = false;

    const pending = [...this.pending.entries()];
    this.pending.clear();
    for (const [, request] of pending) {
      request.reject(error);
    }

    this.onBridgeFailed?.();
  }

  async request(method: string, params: Record<string, unknown>): Promise<JsonRpcMessage> {
    if (!this.bridgeAlive) {
      throw this.bridgeError ?? new Error("OpenCode is not running.");
    }

    const id = this.nextId++;
    const response = new Promise<JsonRpcMessage>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });

    try {
      await acpSend(JSON.stringify({ jsonrpc: "2.0", id, method, params }));
    } catch (error) {
      this.pending.delete(id);
      throw asError(error);
    }

    return response;
  }

  async notify(method: string, params: Record<string, unknown>): Promise<void> {
    if (!this.bridgeAlive) return;
    try {
      await acpSend(JSON.stringify({ jsonrpc: "2.0", method, params }));
    } catch {
      // Best-effort cancel/notify; bridge failure is handled via exited events.
    }
  }

  private handleEvent(event: AcpEvent): void {
    if (event.kind === "exited") {
      const code = event.data.code;
      this.failBridge(
        new Error(
          code === null || code === undefined
            ? "OpenCode exited unexpectedly."
            : `OpenCode exited with code ${code}.`,
        ),
      );
      return;
    }

    if (event.kind === "protocolError") {
      // Startup / decode failures should surface; do not kill a healthy session on a single bad line
      // unless OpenCode is not running yet.
      if (!this.initialized) {
        this.failBridge(new Error(event.data.text));
      }
      return;
    }

    if (event.kind !== "message") return;

    let message: JsonRpcMessage;
    try {
      message = JSON.parse(event.data.raw) as JsonRpcMessage;
    } catch {
      return;
    }

    // Server notification: session/update (and any other method without a request id).
    if (typeof message.method === "string" && !hasRequestId(message.id)) {
      if (message.method === "session/update") {
        const update = message.params?.["update"] as
          | { sessionUpdate?: string; content?: { type?: string; text?: string } }
          | undefined;
        if (update?.sessionUpdate === "agent_message_chunk" && update.content?.text) {
          this.listeners.forEach((listener) => listener(update.content?.text ?? ""));
        }
      }
      return;
    }

    // Agent → client request: method + id, must be answered.
    if (typeof message.method === "string" && hasRequestId(message.id)) {
      void this.respondToAgentRequest(message);
      return;
    }

    // JSON-RPC response to one of our requests.
    if (!hasRequestId(message.id) || typeof message.method === "string") return;
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    if (message.error) {
      pending.reject(new Error(message.error.message));
    } else {
      pending.resolve(message);
    }
  }

  private async respondToAgentRequest(message: JsonRpcMessage): Promise<void> {
    if (message.method === "session/request_permission") {
      await acpSend(
        JSON.stringify({
          jsonrpc: "2.0",
          id: message.id,
          result: { outcome: { outcome: "cancelled" } },
        }),
      );
      return;
    }

    await acpSend(
      JSON.stringify({
        jsonrpc: "2.0",
        id: message.id,
        error: { code: -32601, message: "Client method is not supported." },
      }),
    );
  }
}
