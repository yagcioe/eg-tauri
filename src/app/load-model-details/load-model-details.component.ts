import { Component, computed, inject, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { LoadModelService } from './load-model.service';

@Component({
  selector: 'app-load-model-details',
  imports: [MatInputModule, MatDatepickerModule],
  templateUrl: './load-model-details.component.html',
  styleUrl: './load-model-details.component.css'
})
export class LoadModelDetailsComponent {
  private loadModelService = inject(LoadModelService);

  protected selectedFile = signal<{
    filePath: string;
    fileName: string;
} | undefined>(undefined);

  protected openFile(): void {
    this.loadModelService.openFile().then(file => this.selectedFile.set(file ?? undefined))
  }

  protected onFileChange($event: Event) {
    const files = ($event.target as any)?.files as FileList | null | undefined;

    console.log(files);
    const file = files?.item(0)
    file?.webkitRelativePath
  }

}
