import { CompanyDto } from "../../../specta-bindings/specta-bindings";
import { CompanyModel } from "../models/company.model";
import { RepresentativeParser } from "./representative.parser";

export class CompanyParser {
    public static toModel(dto: CompanyDto): CompanyModel {
        return {
            id: dto.id,
            name: dto.name,
            representatives: dto.representatives.map(RepresentativeParser.toModel),
        }
    }

    public static toDto(model: CompanyModel): CompanyDto {
        return {
            id: model.id,
            name: model.name,
            representatives: model.representatives.map(RepresentativeParser.toDto),
        }
    }
}