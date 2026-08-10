import { invoke, type Channel } from "@tauri-apps/api/core";
import type { AcpEvent } from "../acp/types";

/** Typed wrappers around Tauri `invoke` commands used by the frontend. */

export async function readSelectedPdf(path: string): Promise<ArrayBuffer> {
  const bytes = await invoke<number[]>("read_pdf", { path });
  return Uint8Array.from(bytes).buffer;
}

export async function getWorkspacePath(): Promise<string> {
  return invoke<string>("workspace_path");
}

export async function acpAttach(onEvent: Channel<AcpEvent>): Promise<void> {
  await invoke("acp_attach", { onEvent });
}

export async function acpSend(raw: string): Promise<void> {
  await invoke("acp_send", { raw });
}
