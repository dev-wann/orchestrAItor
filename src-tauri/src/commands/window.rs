use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn toggle_floating_window(app: AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("floating")
        .ok_or_else(|| "floating window not found".to_string())?;

    let visible = window.is_visible().map_err(|e| e.to_string())?;

    if visible {
        window.hide().map_err(|e| e.to_string())?;
    } else {
        window.show().map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub async fn show_main_window(app: AppHandle) -> Result<(), String> {
    let window = app
        .get_webview_window("main")
        .ok_or_else(|| "main window not found".to_string())?;

    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())?;

    Ok(())
}
