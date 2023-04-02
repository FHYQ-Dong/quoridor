#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::{path::Path, fs::File, fs};

use serde_cbor::{from_reader, to_writer, Value};

const QUORIDOR_PATH: &str = "./.quoridor";
const REPLAY_PATH: &str = "./.quoridor/replays";

#[tauri::command]
fn list_replays() -> Vec<(String, Value)> {
  let mut result: Vec<(String, Value)> = Vec::new();
  for entry in Path::new(REPLAY_PATH).read_dir().unwrap() {
    if let Ok(entry) = entry {
      result.push((
        Path::new(&entry.file_name()).file_stem().unwrap().to_str().unwrap().to_string(), 
        from_reader(
          File::open(entry.path()).unwrap()
        ).unwrap()));
    }
  }
  result
}

#[tauri::command]
fn get_replay(id: String) -> Value {
  let mut file_name = id.clone();
  file_name.push_str(".cbor");
  from_reader(File::open(Path::new(REPLAY_PATH).join(file_name)).unwrap()).unwrap()
}

#[tauri::command]
fn put_replay(id: String, replay: Value) {
  let mut file_name = id.clone();
  file_name.push_str(".cbor");
  to_writer(File::create(Path::new(REPLAY_PATH).join(file_name)).unwrap(), &replay).unwrap();
}

#[tauri::command]
fn delete_replay(id: String) {
  let mut file_name = id.clone();
  file_name.push_str(".cbor");
  fs::remove_file(
    Path::new(REPLAY_PATH).join(file_name)
  ).unwrap();
}

fn main() {
  if !Path::new(QUORIDOR_PATH).exists() {
    fs::create_dir(QUORIDOR_PATH).expect("Failed to create quoridor directory.");
    fs::create_dir(REPLAY_PATH).expect("Failed to create replay directory.");
  }
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![list_replays, delete_replay, get_replay, put_replay])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
