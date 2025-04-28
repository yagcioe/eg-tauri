import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { open as openFileDialog } from '@tauri-apps/plugin-dialog';
import { open as openFile, BaseDirectory } from '@tauri-apps/plugin-fs';

@Component({
  selector: 'app-load-model-details',
  imports: [MatInputModule],
  templateUrl: './load-model-details.component.html',
  styleUrl: './load-model-details.component.css'
})
export class LoadModelDetailsComponent {
  protected async openFile(): Promise<void> {
    const filePath = await openFileDialog({ multiple: false, directory: false });
    if(!filePath) return;

    const file = await openFile(filePath, { read: true })
    
    console.log(file);

  }

}
