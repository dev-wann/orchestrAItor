pub mod db;
pub mod keyring;
pub mod models;
pub mod window;

pub const VALID_PROVIDERS: &[&str] = &["anthropic", "openai", "google", "ollama"];

pub fn validate_provider(provider: &str) -> Result<(), String> {
    if VALID_PROVIDERS.contains(&provider) {
        Ok(())
    } else {
        Err(format!("invalid provider: {provider}"))
    }
}
