#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use sysinfo::{System, RefreshKind, CpuRefreshKind};

#[tauri::command]
fn get_cpu_usage() -> f64 {
    let mut system = System::new_with_specifics(
        RefreshKind::new().with_cpu(CpuRefreshKind::new())
    );
    system.refresh_cpu();
    let cpu = system.global_cpu_info();
    cpu.cpu_usage() as f64
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_cpu_usage])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
