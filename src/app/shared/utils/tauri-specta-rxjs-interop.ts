
import * as TAURI_API_EVENT from "@tauri-apps/api/event";
import { Event } from "@tauri-apps/api/event";
import { Observable } from "rxjs";


type ListenableObject<T> = {
    listen: (
        cb: TAURI_API_EVENT.EventCallback<T>,
    ) => ReturnType<typeof TAURI_API_EVENT.listen<T>>;
}

export function toObservable<T>(event: ListenableObject<T>): Observable<Event<T>> {
    return new Observable<Event<T>>(observer => {
        let teardown: (value?: unknown) => void;
        const promiseToTearDown = new Promise((resolve) => {
            teardown = resolve;
        })

        // unlisten to tauri events when Subject is torn down and unlisten is available
        Promise.all([event.listen((event_value) => observer.next(event_value)), promiseToTearDown]).then(([unlisten, _]) => {
            console.log("unsub from tauri stream")
            unlisten();
        });


        return () => teardown()
    })
}