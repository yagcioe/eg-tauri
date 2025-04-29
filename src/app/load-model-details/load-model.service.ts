import { Injectable } from '@angular/core';
import { open as openFileDialog } from '@tauri-apps/plugin-dialog';
import { FileHandle, open as openFile } from '@tauri-apps/plugin-fs';

@Injectable({
  providedIn: 'root'
})
export class LoadModelService {

  public async openFile(): Promise<FileHandle | null> {
    const filePath = await openFileDialog({
      multiple: false, directory: false, filters: [
        {
          name: "JSON",
          extensions: ["json"]
        }
      ]
    });
    if (!filePath) return null;

    return await openFile(filePath, { read: true })
  }
}
