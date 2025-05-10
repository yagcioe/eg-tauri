import { Component, inject, signal } from '@angular/core';
import { MatError } from '@angular/material/input';
import { LoadModelService } from '../load-model.service';
import { ExampleModelUtil } from './example-model.util';
import { Router } from '@angular/router';

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

    const filePath = await this.loadModelService.openModelJsonFile();
    if (!filePath) return;

    this.router.navigate(["file", encodeURI(filePath), "details"])
  }
}
