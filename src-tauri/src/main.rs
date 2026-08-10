#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::io::{BufRead, BufReader, Write};
use std::path::Path;
use std::process::{Child, ChildStdin, Command, Stdio};
use std::sync::{Arc, Mutex};
use std::thread;

use serde::Serialize;
use serde_json::Value;
use tauri::ipc::Channel;
use tauri::{Manager, RunEvent};

#[derive(Clone, Serialize)]
#[serde(tag = "kind", content = "data", rename_all = "camelCase")]
enum AcpEvent {
    Message { raw: String },
    Stderr { text: String },
    ProtocolError { text: String },
    Exited { code: Option<i32> },
}

#[derive(Default)]
struct AcpState {
    writer: Mutex<Option<ChildStdin>>,
    child: Mutex<Option<Child>>,
    channel: Mutex<Option<Channel<AcpEvent>>>,
    buffered: Mutex<Vec<AcpEvent>>,
}

impl AcpState {
    fn emit(&self, event: AcpEvent) {
        let channel = self.channel.lock().expect("ACP channel lock poisoned");
        if let Some(channel) = channel.as_ref() {
            let _ = channel.send(event);
            return;
        }
        drop(channel);
        self.buffered
            .lock()
            .expect("ACP buffer lock poisoned")
            .push(event);
    }
}

fn start_acp(state: Arc<AcpState>) -> Result<(), String> {
    if state
        .writer
        .lock()
        .map_err(|_| "ACP writer lock poisoned".to_string())?
        .is_some()
    {
        return Ok(());
    }

    let mut child = Command::new("opencode")
        .arg("acp")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|error| format!("Could not start `opencode acp`: {error}"))?;

    let stdin = child
        .stdin
        .take()
        .ok_or_else(|| "OpenCode stdin was not available".to_string())?;
    let stdout = child
        .stdout
        .take()
        .ok_or_else(|| "OpenCode stdout was not available".to_string())?;
    let stderr = child
        .stderr
        .take()
        .ok_or_else(|| "OpenCode stderr was not available".to_string())?;

    *state.writer.lock().map_err(|_| "ACP writer lock poisoned".to_string())? = Some(stdin);
    *state.child.lock().map_err(|_| "ACP child lock poisoned".to_string())? = Some(child);

    let output_state = state.clone();
    thread::spawn(move || {
        for line in BufReader::new(stdout).lines() {
            match line {
                Ok(raw) if serde_json::from_str::<Value>(&raw).is_ok() => {
                    output_state.emit(AcpEvent::Message { raw });
                }
                Ok(raw) => output_state.emit(AcpEvent::ProtocolError {
                    text: format!("Invalid JSON from OpenCode: {raw}"),
                }),
                Err(error) => output_state.emit(AcpEvent::ProtocolError {
                    text: format!("Could not read OpenCode stdout: {error}"),
                }),
            }
        }

        // stdout EOF usually means the process exited; reap and notify the frontend.
        let code = {
            let mut child_slot = output_state
                .child
                .lock()
                .expect("ACP child lock poisoned");
            match child_slot.take() {
                Some(mut child) => child.wait().ok().and_then(|status| status.code()),
                None => return, // already reaped by stop_acp
            }
        };
        if let Ok(mut writer) = output_state.writer.lock() {
            writer.take();
        }
        output_state.emit(AcpEvent::Exited { code });
    });

    let error_state = state.clone();
    thread::spawn(move || {
        for line in BufReader::new(stderr).lines() {
            match line {
                Ok(text) if !text.trim().is_empty() => error_state.emit(AcpEvent::Stderr { text }),
                Ok(_) => {}
                Err(error) => error_state.emit(AcpEvent::Stderr {
                    text: format!("Could not read OpenCode stderr: {error}"),
                }),
            }
        }
    });

    Ok(())
}

fn stop_acp(state: &AcpState) {
    if let Ok(mut writer) = state.writer.lock() {
        writer.take();
    }
    if let Ok(mut child) = state.child.lock() {
        if let Some(mut child) = child.take() {
            let _ = child.kill();
            let code = child.wait().ok().and_then(|status| status.code());
            state.emit(AcpEvent::Exited { code });
        }
    }
}

#[tauri::command]
fn acp_attach(state: tauri::State<'_, Arc<AcpState>>, on_event: Channel<AcpEvent>) -> Result<(), String> {
    let mut channel = state.channel.lock().map_err(|_| "ACP channel lock poisoned".to_string())?;
    *channel = Some(on_event);
    let buffered = std::mem::take(
        &mut *state
            .buffered
            .lock()
            .map_err(|_| "ACP buffer lock poisoned".to_string())?,
    );
    if let Some(channel) = channel.as_ref() {
        for event in buffered {
            let _ = channel.send(event);
        }
    }
    Ok(())
}

#[tauri::command]
fn acp_send(state: tauri::State<'_, Arc<AcpState>>, raw: String) -> Result<(), String> {
    let value: Value = serde_json::from_str(&raw).map_err(|error| format!("Invalid ACP JSON: {error}"))?;
    if !value.is_object() || raw.contains('\n') || raw.contains('\r') {
        return Err("ACP messages must be one JSON object per line".to_string());
    }

    let mut writer = state.writer.lock().map_err(|_| "ACP writer lock poisoned".to_string())?;
    let writer = writer.as_mut().ok_or_else(|| "OpenCode is not running".to_string())?;
    writer
        .write_all(raw.as_bytes())
        .and_then(|_| writer.write_all(b"\n"))
        .and_then(|_| writer.flush())
        .map_err(|error| format!("Could not write to OpenCode: {error}"))
}

#[tauri::command]
fn read_pdf(path: String) -> Result<Vec<u8>, String> {
    let candidate = Path::new(&path);
    let extension = candidate
        .extension()
        .and_then(|ext| ext.to_str())
        .map(|ext| ext.eq_ignore_ascii_case("pdf"))
        .unwrap_or(false);
    if !extension {
        return Err("Only PDF files can be opened.".to_string());
    }
    if !candidate.is_file() {
        return Err(format!("PDF path is not a file: `{path}`"));
    }

    fs::read(candidate).map_err(|error| format!("Could not read PDF `{path}`: {error}"))
}

#[tauri::command]
fn workspace_path() -> Result<String, String> {
    std::env::current_dir()
        .map(|path| path.to_string_lossy().into_owned())
        .map_err(|error| format!("Could not determine workspace path: {error}"))
}

fn run() {
    let acp_state = Arc::new(AcpState::default());
    let startup_state = acp_state.clone();

    tauri::Builder::default()
        .manage(acp_state)
        .plugin(tauri_plugin_dialog::init())
        .setup(move |_app| {
            if let Err(error) = start_acp(startup_state.clone()) {
                eprintln!("{error}");
                startup_state.emit(AcpEvent::ProtocolError { text: error });
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![acp_attach, acp_send, read_pdf, workspace_path])
        .build(tauri::generate_context!())
        .expect("error while building Tauri application")
        .run(move |app, event| {
            if matches!(event, RunEvent::Exit) {
                if let Some(state) = app.try_state::<Arc<AcpState>>() {
                    stop_acp(state.inner());
                }
            }
        });
}

fn main() {
    run();
}
