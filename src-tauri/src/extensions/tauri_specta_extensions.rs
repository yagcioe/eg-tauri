use std::fmt::Debug;

use tauri_specta::{Event, TypedEvent};

pub struct DebuggableTypedEvent<T: Event>(pub TypedEvent<T>);

impl<T: Event + Debug> Debug for DebuggableTypedEvent<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let typed_event = &self.0;
        f.debug_struct("TypedEvent")
            .field("id", &typed_event.id)
            .field("payload", &typed_event.payload)
            .finish()
    }
}
