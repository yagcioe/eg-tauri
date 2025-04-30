import { Injectable } from '@angular/core';
import { open as openFileDialog } from '@tauri-apps/plugin-dialog';
import { sep } from "@tauri-apps/api/path"
import { commands } from '../../specta-bindings/specta-bindings2';
import { DemoEvent, events } from '../../specta-bindings/specta-bindings';
import { toObservable } from '../shared/tauri-specta-rxjs-interop';
@Injectable({
  providedIn: 'root'
})
export class LoadModelService {

  public async openFile() {
    const filePath = await openFileDialog({
      multiple: false, directory: false, filters: [
        {
          name: "CSV",
          extensions: ["csv"]
        }
      ]
    });
    if (!filePath) return null;

    const split = filePath.split(sep());
    const fileName = split[split.length - 1];
    return { fileName, content: await commands.openCsvFile(filePath) };
  }

  public listenEvent() {
    return toObservable(events.demoEvent)
  }

  public publishValue(event: DemoEvent): Promise<void> {
    return events.demoEvent.emit(event)
  }
}
