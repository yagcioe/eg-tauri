import { Component, inject, signal } from '@angular/core';
import { MatError } from '@angular/material/input';
import { LoadModelService } from '../load-model.service';
import { ExampleModelUtil } from './example-model.util';

@Component({
  selector: 'app-load-model',
  imports: [MatError],
  templateUrl: './load-model.component.html',
  styleUrl: './load-model.component.scss'
})
export class LoadModelComponent {
  private loadModelService = inject(LoadModelService);
  protected loadModelError = signal<string | undefined>(undefined);
  protected loadedModelFileName = signal<string | undefined>(undefined);

  protected async loadModelFile() {

    const data = await this.loadModelService.loadModelJsonFile();
    if (!data) return;

    const { fileName, content } = data;
    console.log(content)
  }

  protected async loadExampleModel() {
    const exampleModel = ExampleModelUtil.createExampleModel();
    const result = await this.loadModelService.saveModelJsonFile(exampleModel);
    if (result === null) {
      console.error("returned null");
      return;
    }

    if (result.filePathResult.status === "error"){
      console.error(result.filePathResult.error)
      return;
    }

    console.log(result.filePathResult.data)
  }
}
