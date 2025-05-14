import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoadModelService } from '../load-model-details/load-model.service';
import { ActivatedRoute } from '@angular/router';
import { ModelUtil } from '../shared/utils/model.util';

@Component({
  selector: 'app-model-export',
  imports: [MatButtonModule],
  templateUrl: './model-export.component.html',
  styleUrl: './model-export.component.scss'
})
export class ModelExportComponent {
  private loadModelService = inject(LoadModelService);
  private activeRoute = inject(ActivatedRoute)
  protected modelData = ModelUtil.createModelSignals(this.activeRoute, this.loadModelService);

  protected async saveModel() {
    const handle = this.modelData.fileHandle();
    if (!handle) return;

    await this.loadModelService.persistHandle(handle);
  }

  saveModelAs() {
    const model = this.modelData.modelContent();
    if(!model) return;

    this.loadModelService.persistModel(model)
  }
}
