import { Injectable } from '@angular/core';
import { open as openFileDialog, save as saveFileDialog } from '@tauri-apps/plugin-dialog';
import { appCacheDir, sep } from "@tauri-apps/api/path"
import { commands, ModelDto } from '../../specta-bindings/specta-bindings';
import { DemoEvent, events } from '../../specta-bindings/specta-bindings';
import { toObservable } from '../shared/utils/tauri-specta-rxjs-interop';
@Injectable({
  providedIn: 'root'
})
export class LoadModelService {

  public async importCsvFile() {
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

  public async openModelJsonFile() {
    const filePath = await openFileDialog({
      multiple: false, directory: false, filters: [
        {
          name: "JSON",
          extensions: ["json"]
        }
      ]
    });
    return filePath;
  }

  public async loadModelJsonFile(filePath: string) {
    const split = filePath.split(sep());
    const fileName = split[split.length - 1];
    return { fileName, content: await commands.loadModelJsonFile(filePath) };
  }

  public async saveModelJsonFile(model: ModelDto) {
    const t = appCacheDir
    const filePath = await saveFileDialog({
      canCreateDirectories: false,
      filters: [
        {
          name: "JSON",
          extensions: ["json"]
        }
      ]
    });
    if (!filePath) return null;

    const split = filePath.split(sep());
    const fileName = split[split.length - 1];
    return { fileName, filePathResult: await commands.saveModelJsonFile(filePath, model) };
  }

  public listenEvent() {
    return toObservable(events.demoEvent)
  }

  public publishValue(event: DemoEvent): Promise<void> {
    return events.demoEvent.emit(event)
  }
}
