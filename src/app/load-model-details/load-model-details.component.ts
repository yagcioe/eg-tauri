import { Component, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { LoadModelService } from './load-model.service';
import { FileHandle } from '@tauri-apps/plugin-fs';
@Component({
  selector: 'app-load-model-details',
  imports: [MatInputModule, MatDatepickerModule],
  templateUrl: './load-model-details.component.html',
  styleUrl: './load-model-details.component.css'
})
export class LoadModelDetailsComponent {
  private loadModelService = inject(LoadModelService);

  protected selectedFile = signal<FileHandle | undefined>(undefined);

  protected async openFile(): Promise<void> {
    this.loadModelService.openFile().then(file => this.selectedFile.set(file ?? undefined))
  }

}
