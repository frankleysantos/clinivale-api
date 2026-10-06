import { InjectRepository } from "@nestjs/typeorm";
import { PatientEntity } from "./entities/patient.entity";
import { DeepPartial, Repository } from "typeorm";

export class PatientRepository {
    constructor(@InjectRepository(PatientEntity) private readonly patientRepository: Repository<PatientEntity>) {}

    findAll() {
        return this.patientRepository.find();
    }

    findOneById(patient_id: number) {
        return this.patientRepository.findOneBy({id: patient_id});
    }

    create(patient: DeepPartial<PatientEntity>) {
        return this.patientRepository.save(patient);
    }

    update(id: number, patient: DeepPartial<PatientEntity>) {
        return this.patientRepository.update(id, patient);
    }   

}