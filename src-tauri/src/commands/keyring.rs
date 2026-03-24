use keyring::Entry;

const SERVICE_NAME: &str = "com.orchestraitor.app";
const VALID_PROVIDERS: &[&str] = &["anthropic", "openai", "google", "ollama"];

fn validate_provider(provider: &str) -> Result<(), String> {
    if VALID_PROVIDERS.contains(&provider) {
        Ok(())
    } else {
        Err(format!("invalid provider: {provider}"))
    }
}

fn get_entry(provider: &str) -> Result<Entry, String> {
    validate_provider(provider)?;
    Entry::new(SERVICE_NAME, &format!("api_key_{provider}")).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn set_api_key(provider: String, key: String) -> Result<(), String> {
    get_entry(&provider)?.set_password(&key).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_api_key(provider: String) -> Result<String, String> {
    get_entry(&provider)?.get_password().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_api_key(provider: String) -> Result<(), String> {
    get_entry(&provider)?
        .delete_credential()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn has_api_key(provider: String) -> Result<bool, String> {
    let entry = get_entry(&provider)?;
    match entry.get_password() {
        Ok(_) => Ok(true),
        Err(keyring::Error::NoEntry) => Ok(false),
        Err(e) => Err(e.to_string()),
    }
}
