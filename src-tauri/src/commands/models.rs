use std::time::Duration;

use serde::Serialize;

use super::validate_provider;

#[derive(Serialize)]
pub struct ModelInfo {
    pub id: String,
    pub name: String,
}

fn require_api_key(api_key: &Option<String>, provider: &str) -> Result<String, String> {
    api_key
        .clone()
        .filter(|k| !k.is_empty())
        .ok_or_else(|| format!("API key is required for {provider}"))
}

fn http_client() -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .timeout(Duration::from_secs(10))
        .build()
        .map_err(|e| format!("failed to build HTTP client: {e}"))
}

fn hardcoded_anthropic() -> Vec<ModelInfo> {
    vec![
        ModelInfo {
            id: "claude-opus-4-20250514".into(),
            name: "Claude Opus 4".into(),
        },
        ModelInfo {
            id: "claude-sonnet-4-20250514".into(),
            name: "Claude Sonnet 4".into(),
        },
        ModelInfo {
            id: "claude-haiku-4-20250506".into(),
            name: "Claude Haiku 4".into(),
        },
    ]
}

fn hardcoded_google() -> Vec<ModelInfo> {
    vec![
        ModelInfo {
            id: "gemini-2.0-pro".into(),
            name: "Gemini 2.0 Pro".into(),
        },
        ModelInfo {
            id: "gemini-2.0-flash".into(),
            name: "Gemini 2.0 Flash".into(),
        },
        ModelInfo {
            id: "gemini-1.5-pro".into(),
            name: "Gemini 1.5 Pro".into(),
        },
    ]
}

const OPENAI_CHAT_PREFIXES: &[&str] = &["gpt-", "o1", "o3", "chatgpt-"];

fn is_openai_chat_model(id: &str) -> bool {
    OPENAI_CHAT_PREFIXES.iter().any(|p| id.starts_with(p))
}

async fn fetch_openai_models(api_key: &str) -> Result<Vec<ModelInfo>, String> {
    let client = http_client()?;
    let resp = client
        .get("https://api.openai.com/v1/models")
        .header("Authorization", format!("Bearer {api_key}"))
        .send()
        .await
        .map_err(|e| format!("OpenAI request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("OpenAI API error: {}", resp.status()));
    }

    let body: serde_json::Value = resp.json().await.map_err(|e| format!("parse error: {e}"))?;

    let data = body["data"]
        .as_array()
        .ok_or("unexpected OpenAI response format")?;

    let mut models: Vec<ModelInfo> = data
        .iter()
        .filter_map(|m| {
            let id = m["id"].as_str()?;
            if is_openai_chat_model(id) {
                Some(ModelInfo {
                    id: id.to_string(),
                    name: id.to_string(),
                })
            } else {
                None
            }
        })
        .collect();

    models.sort_by(|a, b| a.id.cmp(&b.id));
    Ok(models)
}

async fn fetch_ollama_models() -> Result<Vec<ModelInfo>, String> {
    let client = http_client()?;
    let resp = client
        .get("http://localhost:11434/api/tags")
        .send()
        .await
        .map_err(|e| format!("Ollama request failed: {e}"))?;

    if !resp.status().is_success() {
        return Err(format!("Ollama API error: {}", resp.status()));
    }

    let body: serde_json::Value = resp.json().await.map_err(|e| format!("parse error: {e}"))?;

    let models_arr = body["models"]
        .as_array()
        .ok_or("unexpected Ollama response format")?;

    let models: Vec<ModelInfo> = models_arr
        .iter()
        .filter_map(|m| {
            let name = m["name"].as_str()?;
            Some(ModelInfo {
                id: name.to_string(),
                name: name.to_string(),
            })
        })
        .collect();

    Ok(models)
}

#[tauri::command]
pub async fn fetch_models(
    provider: String,
    api_key: Option<String>,
) -> Result<Vec<ModelInfo>, String> {
    validate_provider(&provider)?;

    match provider.as_str() {
        "anthropic" => Ok(hardcoded_anthropic()),
        "google" => Ok(hardcoded_google()),
        "openai" => {
            let key = require_api_key(&api_key, "openai")?;
            fetch_openai_models(&key).await
        }
        "ollama" => fetch_ollama_models().await,
        _ => unreachable!(),
    }
}
