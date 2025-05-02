import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { LoadModelService } from '../load-model-details/load-model.service';

@Component({
  selector: 'app-model-details',
  imports: [],
  templateUrl: './model-details.component.html',
  styleUrl: './model-details.component.scss'
})
export class ModelDetailsComponent {
  private readonly activeRoute = inject(ActivatedRoute);
  private readonly loadModelService = inject(LoadModelService);

  private modelFilePath = this.activeRoute.params.pipe(map(params => decodeURI(params["filepath"]) as string), takeUntilDestroyed())
  protected model = toSignal(this.modelFilePath.pipe(switchMap(path => this.loadModelService.loadModelJsonFile(path)), takeUntilDestroyed()))
  protected modelJson = computed(()=> JSON.stringify(this.model()))
}
