import moment from "moment";
import { ApplicationDto, CompanyDto, ModelDto, RepresentativeDto, SlotDto, StudentDto } from "../../../specta-bindings/specta-bindings";
import { ObjectUtil } from "../../shared/utils/object.util";
import { LoadModelParser } from "./load-model.parser";
import { ModelModel } from "../../shared/models/model.model";
import { ModelParser } from "../../shared/parser/model.parser";

export class ExampleModelUtil {

    public static createExampleModel(): ModelModel {
        const slots: SlotDto[] = [];
        for (let i = 0; i < 54; i++) {
            slots.push({
                penalty: i < 9 || i >= 51 ? 10 : 0
            })
        }
        const students = this.createExampleStudents();
        const companies = this.createExampleCompanies();

        return ModelParser.toModel({
            cabin_count: 20,
            max_start_per_slot: 5,
            talk_slot_count: 3,
            minimum_representative_break_slot_count: 1,
            minimum_student_break_slot_count: 2,
            day_start_time: moment({ hour: 8, minutes: 30 }).format("hh:mm:ss"),
            slot_duration: moment({minutes:10}).format("hh:mm:ss"),
            slots,
            applications: this.createExampleApplications(students, companies),
            companies: this.createExampleCompanies(),
            students: ExampleModelUtil.createExampleStudents()
        })
    }

    private static createExampleStudents(): StudentDto[] {
        return [
            { id: 247, name: "Amelie", email: "Amelie@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 330, name: "Amy", email: "Amy@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 513, name: "Ben", email: "Ben@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 845, name: "Carla", email: "Carla@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 195, name: "Edda", email: "Edda@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 903, name: "Elias", email: "Elias@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 763, name: "Elisabeth", email: "Elisabeth@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 406, name: "Ella", email: "Ella@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 218, name: "Emely", email: "Emely@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 490, name: "Eva", email: "Eva@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 615, name: "Felix", email: "Felix@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 180, name: "Flora", email: "Flora@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 786, name: "Frieda", email: "Frieda@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 954, name: "Henry", email: "Henry@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 483, name: "Julia", email: "Julia@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 545, name: "Julian", email: "Julian@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 167, name: "Juna", email: "Juna@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 628, name: "Karl", email: "Karl@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 102, name: "Katharina", email: "Katharina@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 389, name: "Liam", email: "Liam@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 917, name: "Linus", email: "Linus@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 926, name: "Lucy", email: "Lucy@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 836, name: "Luis", email: "Luis@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 269, name: "Luise", email: "Luise@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 242, name: "Lukas", email: "Lukas@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 707, name: "Maya", email: "Maya@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 499, name: "Mia", email: "Mia@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 764, name: "Niklas", email: "Niklas@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 491, name: "Noah", email: "Noah@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 306, name: "Paul", email: "Paul@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 572, name: "Paulina", email: "Paulina@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 751, name: "Philipp", email: "Philipp@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 681, name: "Quentin", email: "Quentin@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 684, name: "Quirin", email: "Quirin@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 444, name: "Selma", email: "Selma@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 704, name: "Simone", email: "Simone@konaktiva.tu-darmstadt.de", availability: [] },
            { id: 191, name: "Tim", email: "Tim@konaktiva.tu-darmstadt.de", availability: [] },

        ]
    }

    private static createExampleCompanies(): CompanyDto[] {
        return [
            this.createExampleCompany({ id: 19, name: "Computerwerk" }),
            this.createExampleCompany({ id: 77, name: "DART" }),
            this.createExampleCompany({ id: 98, name: "VWI|ESTIEM" }),
            this.createExampleCompany({ id: 80, name: "ESN" }),
            this.createExampleCompany({ id: 14, name: "Akaflieg" }),
            this.createExampleCompany({ id: 53, name: "WiBiNet" }),
            this.createExampleCompany({ id: 59, name: "Akamu" }),
            this.createExampleCompany({ id: 37, name: "Börsenkreis" }),
            this.createExampleCompany({ id: 83, name: "JuniorComptec" }),
            this.createExampleCompany({ id: 82, name: "Filmkreis" }),

        ]
    }

    private static createExampleCompany(opt: { id: number, name: string }): CompanyDto {
        return { ...opt, representatives: [LoadModelParser.createDefaultRepresentative()] }
    }


    private static createExampleApplications(students: StudentDto[], companies: CompanyDto[]): ApplicationDto[] {
        const studentMap = ObjectUtil.toMap(students, s => s.id);
        const companyMap = ObjectUtil.toMap(companies, s => s.id);
        const data: { id: number, studentId: number, companyId: number }[] = [
            { id: 1000, studentId: 247, companyId: 19 },
            { id: 1001, studentId: 330, companyId: 77 },
            { id: 1002, studentId: 513, companyId: 98 },
            { id: 1003, studentId: 845, companyId: 98 },
            { id: 1004, studentId: 195, companyId: 80 },
            { id: 1005, studentId: 903, companyId: 19 },
            { id: 1006, studentId: 763, companyId: 14 },
            { id: 1007, studentId: 763, companyId: 77 },
            { id: 1008, studentId: 406, companyId: 53 },
            { id: 1009, studentId: 218, companyId: 77 },
            { id: 1010, studentId: 218, companyId: 53 },
            { id: 1011, studentId: 490, companyId: 19 },
            { id: 1012, studentId: 615, companyId: 59 },
            { id: 1013, studentId: 615, companyId: 37 },
            { id: 1014, studentId: 180, companyId: 14 },
            { id: 1015, studentId: 786, companyId: 14 },
            { id: 1016, studentId: 786, companyId: 83 },
            { id: 1017, studentId: 954, companyId: 14 },
            { id: 1018, studentId: 954, companyId: 19 },
            { id: 1019, studentId: 483, companyId: 37 },
            { id: 1020, studentId: 545, companyId: 19 },
            { id: 1021, studentId: 167, companyId: 80 },
            { id: 1022, studentId: 628, companyId: 14 },
            { id: 1023, studentId: 628, companyId: 37 },
            { id: 1024, studentId: 628, companyId: 82 },
            { id: 1025, studentId: 102, companyId: 14 },
            { id: 1026, studentId: 102, companyId: 83 },
            { id: 1027, studentId: 389, companyId: 77 },
            { id: 1028, studentId: 389, companyId: 80 },
            { id: 1029, studentId: 389, companyId: 83 },
            { id: 1030, studentId: 917, companyId: 80 },
            { id: 1031, studentId: 917, companyId: 53 },
            { id: 1032, studentId: 926, companyId: 14 },
            { id: 1033, studentId: 836, companyId: 14 },
            { id: 1034, studentId: 269, companyId: 14 },
            { id: 1035, studentId: 269, companyId: 59 },
            { id: 1036, studentId: 242, companyId: 37 },
            { id: 1037, studentId: 707, companyId: 77 },
            { id: 1038, studentId: 499, companyId: 19 },
            { id: 1039, studentId: 499, companyId: 80 },
            { id: 1040, studentId: 764, companyId: 59 },
            { id: 1041, studentId: 764, companyId: 77 },
            { id: 1042, studentId: 764, companyId: 98 },
            { id: 1043, studentId: 491, companyId: 37 },
            { id: 1044, studentId: 306, companyId: 80 },
            { id: 1045, studentId: 306, companyId: 98 },
            { id: 1046, studentId: 572, companyId: 53 },
            { id: 1047, studentId: 751, companyId: 14 },
            { id: 1048, studentId: 751, companyId: 80 },
            { id: 1049, studentId: 751, companyId: 82 },
            { id: 1050, studentId: 681, companyId: 37 },
            { id: 1051, studentId: 684, companyId: 37 },
            { id: 1052, studentId: 684, companyId: 19 },
            { id: 1053, studentId: 444, companyId: 98 },
            { id: 1054, studentId: 704, companyId: 19 },
            { id: 1055, studentId: 704, companyId: 98 },
            { id: 1056, studentId: 191, companyId: 59 },
        ]
        return data.map(d => this.createExampleApplication({ id: d.id, student: studentMap[d.studentId], company: companyMap[d.companyId] }));
    }

    private static createExampleApplication(opt: { id: number, student: StudentDto | undefined, company: CompanyDto | undefined, }): ApplicationDto {
        if (!opt.student || !opt.company) {
            throw "unexpected undefined value in example model creation";
        }
        return { id: opt.id, company_id: opt.company.id, student_id: opt.student.id, representative_ids: opt.company.representatives.map(r => r.id) }
    }
}
