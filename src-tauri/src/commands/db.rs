// commands/db.rs
//
// Database-related Tauri commands.
//
// In tauri-plugin-sql v2 the standard pattern is:
//   - Rust side: register the plugin with migrations (done in lib.rs).
//   - JS/TS side: use `@tauri-apps/plugin-sql` to open the database and
//     execute queries directly from the frontend.
//
// This module is reserved for server-side logic that is impractical to
// express in the frontend layer (e.g. batch operations, transactions that
// span multiple tables, heavy data transformations, etc.).
//
// For M0 there are no such cases, so the module is intentionally empty.
// Future milestones will add Tauri commands here as needed.
