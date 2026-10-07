import { InjectRepository } from "@nestjs/typeorm";
import { PatientEntity } from "./entities/patient.entity";
import { DeepPartial, Repository } from "typeorm";

export class PatientRepository {
    constructor(@InjectRepository(PatientEntity) private readonly patientRepository: Repository<PatientEntity>) {}

    findAll(client_id?: number) {
        return this.patientRepository.find({
            where: client_id ? { clients: { id: client_id } } : {},
            relations: ['clients'],
            order: { id: 'DESC' },
        });
    }

    findOneById(patient_id: number) {
        return this.patientRepository.findOne({
            where: { id: patient_id },
            relations: ['clients'],
        });
    }

    create(patient: DeepPartial<PatientEntity>) {
        return this.patientRepository.save(patient);
    }

    async update(id: number, patient: DeepPartial<PatientEntity>) {
        await this.patientRepository.save({ id, ...patient });
        return this.findOneById(id);
    }

    remove(id: number) {
        return this.patientRepository.delete(id);
    }
}