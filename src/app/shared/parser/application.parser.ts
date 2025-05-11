import { ApplicationDto } from "../../../specta-bindings/specta-bindings";
import { ApplicationModel } from "../models/application.model";

export class ApplicationParser {
    public static toModel(dto: ApplicationDto): ApplicationModel {
        return {
            companyId: dto.company_id,
            id: dto.id,
            representativeIds: [...dto.representative_ids],
            studentId: dto.student_id
        }
    }

    public static toDto(model: ApplicationModel): ApplicationDto {
        return {
            company_id: model.companyId,
            id: model.id,
            representative_ids: [...model.representativeIds],
            student_id: model.studentId
        }
    }
}