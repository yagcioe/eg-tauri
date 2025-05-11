import { Component, inject, signal } from '@angular/core';
import { MatError } from '@angular/material/input';
import { Router } from '@angular/router';
import { ROUTE_SCHEMA } from '../../app.routes';
import { LoadModelService } from '../load-model.service';

@Component({
  selector: 'app-load-model',
  imports: [MatError],
  templateUrl: './load-model.component.html',
  styleUrl: './load-model.component.scss'
})
export class LoadModelComponent {
  private loadModelService = inject(LoadModelService);
  private router = inject(Router);

  protected loadModelError = signal<string | undefined>(undefined);
  protected loadedModelFileName = signal<string | undefined>(undefined);

  protected async loadModelFile() {

    const loadResult = await this.loadModelService.loadModelJsonFile();
    if (!loadResult || loadResult.content.status !== "ok") return;

    this.router.navigate([loadResult.content.data.fileHandle, ROUTE_SCHEMA.FILE_HANDLE.DETAILS])
  }
}
