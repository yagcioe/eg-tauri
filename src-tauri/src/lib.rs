use grb::{ModelSense::Minimize, *};

fn gurobi_private() -> std::result::Result<(), grb::Error> {
    let mut model = Model::new("model1")?;

    // add decision variables with no bounds
    let x1 = add_ctsvar!(model, name: "x1", bounds: ..)?;
    let x2 = add_intvar!(model, name: "x2", bounds: ..)?;

    // add linear constraints
    let c0 = model.add_constr("c0", c!(x1 + 2 * x2 >= -14))?;
    let c1 = model.add_constr("c1", c!(-4 * x1 - x2 <= -33))?;
    let c2 = model.add_constr("c2", c!(2 * x1 <= 20 - x2))?;

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

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn gurobi() {
    gurobi_private().unwrap()
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, gurobi])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
