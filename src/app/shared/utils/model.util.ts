import { computed } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { Observable, map, of, switchMap } from "rxjs";
import { ROUTE_SCHEMA, ROUTE_INDEX } from "../../app.routes";
import { ActivatedRoute } from "@angular/router";
import { LoadModelService } from "../../load-model-details/load-model.service";

export class ModelUtil {


    public static createModelSignals(activeRoute: ActivatedRoute, loadModelService: LoadModelService) {
        const modelFileHandle: Observable<string | undefined> = activeRoute.parent?.params.pipe(map(params => params[ROUTE_SCHEMA.FILE_HANDLE[ROUTE_INDEX]] as string), takeUntilDestroyed()) ?? of(undefined)
        const fileHandle = toSignal(modelFileHandle);

        const modelLoadingResult = toSignal(modelFileHandle.pipe(switchMap(fileHandle => fileHandle ? loadModelService.getModel(fileHandle) : of(undefined)), takeUntilDestroyed()))

        const modelContent = computed(() => {
            const modResult = modelLoadingResult();
            if (!modResult || modResult.status !== "ok") return;

            return modResult.data ?? undefined;
        });

        return { modelFileHandle, fileHandle, modelLoadingResult, modelContent }
    }
}