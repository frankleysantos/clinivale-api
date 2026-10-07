import { InjectRepository } from "@nestjs/typeorm";
import { ClientEntity } from "./entities/client.entity";
import { DeepPartial, Repository } from "typeorm";


export class ClientRepository {
    constructor(@InjectRepository(ClientEntity) private readonly clientRepository: Repository<ClientEntity>) {}

    getAll() {
        return this.clientRepository.find({
            relations: ['users', 'patients']
        });   
    }

    findOneById(id: number) {
        return this.clientRepository.findOne({
            where: { id },
            relations: ['users', 'patients']
        });
    }

    create(client: DeepPartial<ClientEntity>) {
        return this.clientRepository.save(client);  
    }

    async update(id: number, client: DeepPartial<ClientEntity>) {
        await this.clientRepository.save({ id, ...client });
        return this.findOneById(id);
    }

    remove(id: number) {
        return this.clientRepository.delete(id);
    }
}