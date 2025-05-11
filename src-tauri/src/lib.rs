mod extensions;
mod load_model_details;
mod models;
mod app_state;

use std::sync::Mutex;

use app_state::AppState;
use grb::{ModelSense::Minimize, *};
use serde::{Deserialize, Serialize};
use specta::Type;
use specta_typescript::Typescript;
use tauri::{Listener, Manager};
use tauri_helper::{array_collect_commands, specta_collect_commands, tauri_collect_commands};
use tauri_specta::{collect_events, Builder, Event};

use load_model_details::commands::*;

#[derive(Serialize, Deserialize, Debug, Clone, Type, Event)]
pub struct DemoEvent {
    name: String,
}

fn gurobi_private() -> std::result::Result<(), grb::Error> {
    let mut model = Model::new("model1")?;

    // add decision variables with no bounds
    let x1 = add_ctsvar!(model, name: "x1", bounds: ..)?;
    let x2 = add_intvar!(model, name: "x2", bounds: ..)?;

    // add linear constraints
    let c0 = model.add_constr("c0", c!(x1 + 2 * x2 >= -14))?;
    model.add_constr("c1", c!(-4 * x1 - x2 <= -33))?;
    model.add_constr("c2", c!(2 * x1 <= 20 - x2))?;

    // model is lazily updated by default
    assert_eq!(
        model.get_obj_attr(attr::VarName, &x1).unwrap_err(),
        grb::Error::ModelObjectPending
    );
    assert_eq!(model.get_attr(attr::IsMIP)?, 0);

    // set the objective function, which updates the model objects (variables and constraints).
    // One could also call `model.update()`
    model.set_objective(8 * x1 + x2, Minimize)?;
    assert_eq!(model.get_obj_attr(attr::VarName, &x1)?, "x1");
    assert_eq!(model.get_attr(attr::IsMIP)?, 1);

    // write model to the file.
    model.write("model.lp")?;

    // optimize the model
    model.optimize()?;
    assert_eq!(model.status()?, Status::Optimal);

    // Querying a model attribute
    assert_eq!(model.get_attr(attr::ObjVal)?, 59.0);

    // Querying a model object attributes
    assert_eq!(model.get_obj_attr(attr::Slack, &c0)?, -34.5);
    let x1_name = model.get_obj_attr(attr::VarName, &x1)?;

    // Querying an attribute for multiple model objects
    let val = model.get_obj_attr_batch(attr::X, vec![x1, x2])?;
    assert_eq!(val, [6.5, 7.0]);

    // Querying variables by name
    assert_eq!(model.get_var_by_name(&x1_name)?, Some(x1));

    return Ok(());
}

fn initalize_app() {
    dbg!(array_collect_commands!());

    let builder = Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(specta_collect_commands!())
        .events(collect_events![DemoEvent]);
    builder
        .export(
            Typescript::default(),
            "../src/specta-bindings/specta-bindings.ts",
        )
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri_collect_commands!())
        .setup(move |app| {
            app.manage(Mutex::new(AppState::default()));

            builder.mount_events(app);

            DemoEvent::listen(app, |event| {
                let dbg_event = extensions::tauri_specta_extensions::DebuggableTypedEvent(event);
                dbg!(dbg_event);
            });

            app.listen("demo-event", |event| {
                dbg!(event);
            });

            app.listen_any("any", |event_any| {
                dbg!(event_any);
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    initalize_app();
}
