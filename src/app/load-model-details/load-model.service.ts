import { Injectable } from '@angular/core';
import { sep } from "@tauri-apps/api/path";
import { open as openFileDialog, save as saveFileDialog } from '@tauri-apps/plugin-dialog';
import { commands, CompanyDto, DemoEvent, events } from '../../specta-bindings/specta-bindings';
import { ModelModel } from '../shared/models/model.model';
import { ModelParser } from '../shared/parser/model.parser';
import { SpectaUtil } from '../shared/utils/specta.util';
import { toObservable } from '../shared/utils/tauri-specta-rxjs-interop';
import { CompanyModel } from '../shared/models/company.model';
import { CompanyParser } from '../shared/parser/company.parser';
@Injectable({
  providedIn: 'root'
})
export class LoadModelService {

  public async importCsvFile() {
    const filePath = await this.openCsvFile()
    if (!filePath) return null;

    const split = filePath.split(sep());
    const fileName = split[split.length - 1];
    return { fileName, content: await commands.openCsvFile(filePath) };
  }

  public openCsvFile() {
    return openFileDialog({
      multiple: false, directory: false, filters: [
        {
          name: "CSV",
          extensions: ["csv"]
        }
      ]
    });
  }

  public openJsonFile() {
    return openFileDialog({
      multiple: false, directory: false, filters: [
        {
          name: "JSON",
          extensions: ["json"]
        }
      ]
    });
  }

  public async saveJsonFile() {
    return saveFileDialog({
      canCreateDirectories: false,
      filters: [
        {
          name: "JSON",
          extensions: ["json"]
        }
      ]
    })
  }

  public async loadModelJsonFile() {
    const filePath = await this.openJsonFile();
    if (!filePath) return;
    return await this.loadModel(filePath);
  }

  public async getModel(fileHandle: string) {
    return SpectaUtil.mapResult(await commands.getModel(fileHandle), (model) => model ? ModelParser.toModel(model) : null)
  }

  public async loadModel(filePath: string) {
    const split = filePath.split(sep());
    const fileName = split[split.length - 1];
    const resultDto = await commands.loadModel(filePath);
    return { fileName, content: SpectaUtil.mapResult(resultDto, (fileHandle) => ({ fileHandle })) };
  }

  public async persistHandle(file_handle: string) {
    return SpectaUtil.mapResult(await commands.persistHandle(file_handle), (filePath) => ({ filePath }));
  }

  public async persistModel(model: ModelModel) {
    const filePath = await this.saveJsonFile();
    if (!filePath) return;

    return SpectaUtil.mapResult(await commands.persistModel(filePath, ModelParser.toDto(model)), (filePath) => ({ filePath }))
  }
  
  public update = {
    async model(fileHandle: string, model: ModelModel) {
      return SpectaUtil.mapResult(await commands.updateModel(fileHandle, ModelParser.toDto(model)), (fileHandle) => ({ fileHandle }));
    },

    async companies(fileHandle: string, companies: CompanyModel[]) {
      const companyDtos = companies.map(CompanyParser.toDto);
      console.log("dtos", companyDtos)
      return SpectaUtil.mapResult(await commands.updateCompanies(fileHandle, companyDtos), (fileHandle) => ({ fileHandle }));
    }
  }

  public listenEvent() {
    return toObservable(events.demoEvent)
  }

  public publishValue(event: DemoEvent): Promise<void> {
    return events.demoEvent.emit(event)
  }
}
