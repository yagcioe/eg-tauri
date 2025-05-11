import { Injectable } from '@angular/core';
import { sep } from "@tauri-apps/api/path";
import { open as openFileDialog, save as saveFileDialog } from '@tauri-apps/plugin-dialog';
import { commands, DemoEvent, events, Result } from '../../specta-bindings/specta-bindings';
import { ModelModel } from '../shared/models/model.model';
import { ModelParser } from '../shared/parser/model.parser';
import { toObservable } from '../shared/utils/tauri-specta-rxjs-interop';
import { SpectaUtil } from '../shared/utils/specta.util';
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
    const resultDto = await commands.loadModelJsonFile(filePath);
    return { fileName, content: SpectaUtil.mapResult(resultDto, ModelParser.toModel) };
  }

  public async saveModelJsonFile(model: ModelModel) {
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
    return { fileName, filePathResult: await commands.saveModelJsonFile(filePath, ModelParser.toDto(model)) };
  }

  public listenEvent() {
    return toObservable(events.demoEvent)
  }

  public publishValue(event: DemoEvent): Promise<void> {
    return events.demoEvent.emit(event)
  }
}
