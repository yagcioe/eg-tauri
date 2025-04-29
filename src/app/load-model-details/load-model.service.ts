import { Injectable } from '@angular/core';
import { open as openFileDialog } from '@tauri-apps/plugin-dialog';
import { sep } from "@tauri-apps/api/path"
import { commands } from '../../specta-bindings2';
@Injectable({
  providedIn: 'root'
})
export class LoadModelService {

  public async openFile(): Promise<{ filePath: string, fileName: string } | null> {
    const filePath = await openFileDialog({
      multiple: false, directory: false, filters: [
        {
          name: "JSON",
          extensions: ["json"]
        }
      ]
    });
    if (!filePath) return null;

    const split = filePath.split(sep());
    const fileName = split[split.length - 1];
    commands.openJsonFile(filePath).then(result => result.status === "ok" ? console.log(result.data) : console.log(result.error));
    return {
      filePath,
      fileName
    }
  }
}
