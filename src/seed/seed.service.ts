import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { ClientEntity } from 'src/client/entities/client.entity';
import { RoleEntity } from 'src/roles/entities/role.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CouncilEntity } from 'src/user/entities/council.entity';
import { ProfessionEntity } from 'src/user/entities/profession.entity';
import { SpecialtyEntity } from 'src/user/entities/specialty.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CouncilEntity)
    private readonly councilRepository: Repository<CouncilEntity>,
    @InjectRepository(ProfessionEntity)
    private readonly professionRepository: Repository<ProfessionEntity>,
    @InjectRepository(SpecialtyEntity)
    private readonly specialtyRepository: Repository<SpecialtyEntity>,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
  ) {}

  async onApplicationBootstrap() {
    try {
      await this.runSeed();
    } catch (error) {
      this.logger.error('Erro ao executar seed automático no bootstrap:', error);
    }
  }

  async runSeed() {
    this.logger.log('Iniciando execução de seed...');

    // 1. Criar ou buscar o cliente master "Clinivale"
    let clinivaleClient = await this.clientRepository.findOne({
      where: [{ name: 'Clinivale' }, { name: 'CLINIVALE' }],
    });

    if (!clinivaleClient) {
      clinivaleClient = await this.clientRepository.save({
        name: 'Clinivale',
        type: 'JURIDICA',
        cnpj: '12345678000195',
        email: 'admin@clinivale.com',
        cellphone: '11999999999',
        status: 'ATIVO',
      });
      this.logger.log(`Cliente master Clinivale criado com ID: ${clinivaleClient.id}`);
    }

    // 2. Mapear todas as permissões (controllers e métodos) do sistema
    const permissions: Array<{ controller: string; method: string }> = [];
    const controllers = this.discoveryService.getControllers();

    for (const wrapper of controllers) {
      const { instance } = wrapper;
      if (!instance) continue;

      const prototype = Object.getPrototypeOf(instance);
      const controllerName = wrapper.metatype?.name || instance.constructor.name;

      if (!controllerName) continue;

      const methodNames = this.metadataScanner.getAllMethodNames(prototype);
      for (const methodName of methodNames) {
        if (methodName !== 'constructor') {
          permissions.push({
            controller: controllerName,
            method: methodName,
          });
        }
      }
    }

    // 3. Criar ou atualizar a role "ADMINISTRADOR" associada à Clinivale
    let adminRole = await this.roleRepository.findOne({
      where: [
        { name: 'ADMINISTRADOR', client_id: clinivaleClient.id },
        { name: 'ADMINISTRADOR', client_id: IsNull() },
      ],
    });

    if (!adminRole) {
      adminRole = await this.roleRepository.save({
        name: 'ADMINISTRADOR',
        client_id: clinivaleClient.id,
        permissions: permissions,
      });
      this.logger.log(`Role ADMINISTRADOR criada com ID: ${adminRole.id} e ${permissions.length} permissões.`);
    } else {
      adminRole.client_id = clinivaleClient.id;
      adminRole.permissions = permissions;
      adminRole = await this.roleRepository.save(adminRole);
      this.logger.log(`Role ADMINISTRADOR atualizada com ${permissions.length} permissões.`);
    }

    // 4. Criar ou atualizar o usuário master
    const adminEmail = 'admin@clinivale.com';
    let adminUser = await this.userRepository.findOne({
      where: { email: adminEmail },
      relations: ['clients', 'roles'],
    });

    const hashedPassword = await bcrypt.hash('admin123', 10);

    if (!adminUser) {
      adminUser = await this.userRepository.save({
        name: 'Administrador Master',
        email: adminEmail,
        password: hashedPassword,
        clients: [clinivaleClient],
        roles: [adminRole],
      });
      this.logger.log(`Usuário master Clinivale criado com sucesso (ID: ${adminUser.id}, email: ${adminEmail})`);
    } else {
      adminUser.password = hashedPassword;
      const hasClient = adminUser.clients?.some((c) => Number(c.id) === Number(clinivaleClient.id));
      if (!hasClient) {
        adminUser.clients = [...(adminUser.clients || []), clinivaleClient];
      }

      const hasRole = adminUser.roles?.some((r) => Number(r.id) === Number(adminRole.id));
      if (!hasRole) {
        adminUser.roles = [...(adminUser.roles || []), adminRole];
      }

      adminUser = await this.userRepository.save(adminUser);
      this.logger.log(`Usuário master Clinivale atualizado com sucesso (ID: ${adminUser.id})`);
    }

    // 5. Seed de Conselhos Profissionais de Saúde
    const defaultCouncils = [
      { code: 'CRM', name: 'Conselho Regional de Medicina', description: 'Médicos' },
      { code: 'CRO', name: 'Conselho Regional de Odontologia', description: 'Cirurgiões-Dentistas' },
      { code: 'CRP', name: 'Conselho Regional de Psicologia', description: 'Psicólogos' },
      { code: 'COREN', name: 'Conselho Regional de Enfermagem', description: 'Enfermeiros' },
      { code: 'CREFITO', name: 'Conselho Regional de Fisioterapia e Terapia Ocupacional', description: 'Fisioterapeutas e Terapeutas Ocupacionais' },
      { code: 'CRN', name: 'Conselho Regional de Nutricionistas', description: 'Nutricionistas' },
      { code: 'CRF', name: 'Conselho Regional de Farmácia', description: 'Farmacêuticos' },
      { code: 'CRFa', name: 'Conselho Regional de Fonoaudiologia', description: 'Fonoaudiólogos' },
      { code: 'CRBM', name: 'Conselho Regional de Biomedicina', description: 'Biomédicos' },
    ];

    const councilMap = new Map<string, CouncilEntity>();
    for (const c of defaultCouncils) {
      let council = await this.councilRepository.findOne({ where: { code: c.code } });
      if (!council) {
        council = await this.councilRepository.save({
          code: c.code,
          name: c.name,
          description: c.description,
          status: 'ACTIVE',
        });
        this.logger.log(`Conselho ${c.code} cadastrado.`);
      }
      councilMap.set(c.code, council);
    }

    // 6. Seed de Profissões de Saúde (ligadas aos conselhos)
    const defaultProfessions = [
      { name: 'Médico', councilCode: 'CRM' },
      { name: 'Cirurgião-Dentista', councilCode: 'CRO' },
      { name: 'Psicólogo', councilCode: 'CRP' },
      { name: 'Fisioterapeuta', councilCode: 'CREFITO' },
      { name: 'Nutricionista', councilCode: 'CRN' },
      { name: 'Enfermeiro', councilCode: 'COREN' },
      { name: 'Fonoaudiólogo', councilCode: 'CRFa' },
      { name: 'Farmacêutico', councilCode: 'CRF' },
      { name: 'Terapeuta Ocupacional', councilCode: 'CREFITO' },
      { name: 'Biomédico', councilCode: 'CRBM' },
    ];

    const professionMap = new Map<string, ProfessionEntity>();
    for (const p of defaultProfessions) {
      let profession = await this.professionRepository.findOne({ where: { name: p.name } });
      const council = p.councilCode ? councilMap.get(p.councilCode) : undefined;
      if (!profession) {
        profession = await this.professionRepository.save({
          name: p.name,
          council_id: council ? council.id : null,
          status: 'ACTIVE',
        });
        this.logger.log(`Profissão ${p.name} cadastrada.`);
      }
      professionMap.set(p.name, profession);
    }

    // 7. Seed de Especialidades agrupadas por Profissão
    const defaultSpecialtiesByProfession: Array<{ professionName: string; specialties: string[] }> = [
      {
        professionName: 'Médico',
        specialties: [
          'Alergia e Imunologia',
          'Anestesiologia',
          'Angiologia',
          'Cardiologia',
          'Cirurgia Cardiovascular',
          'Cirurgia da Mão',
          'Cirurgia do Aparelho Digestivo',
          'Cirurgia Geral',
          'Cirurgia Oncológica',
          'Cirurgia Pediátrica',
          'Cirurgia Plástica',
          'Cirurgia Torácica',
          'Cirurgia Vascular',
          'Clínica Médica',
          'Coloproctologia',
          'Dermatologia',
          'Endocrinologia e Metabologia',
          'Gastroenterologia',
          'Geriatria',
          'Ginecologia e Obstetrícia',
          'Infectologia',
          'Medicina de Família e Comunidade',
          'Medicina do Trabalho',
          'Nefrologia',
          'Neurocirurgia',
          'Neurologia',
          'Nutrologia',
          'Oftalmologia',
          'Ortopedia e Traumatologia',
          'Otorrinolaringologia',
          'Pediatria',
          'Pneumologia',
          'Psiquiatria',
          'Radiologia e Diagnóstico por Imagem',
          'Reumatologia',
          'Urologia',
        ],
      },
      {
        professionName: 'Psicólogo',
        specialties: [
          'Psicologia Clínica',
          'Psicanálise',
          'Terapia Cognitivo-Comportamental (TCC)',
          'Neuropsicologia',
          'Psicologia Hospitalar',
          'Psicologia Social',
          'Psicopedagogia',
        ],
      },
      {
        professionName: 'Fisioterapeuta',
        specialties: [
          'Fisioterapia Respiratória',
          'Fisioterapia Traumato-Ortopédica',
          'Fisioterapia Neurofuncional',
          'Fisioterapia Dermatofuncional',
          'Fisioterapia Esportiva',
          'Fisioterapia em Terapia Intensiva',
        ],
      },
      {
        professionName: 'Cirurgião-Dentista',
        specialties: [
          'Ortodontia',
          'Endodontia',
          'Implantodontia',
          'Periodontia',
          'Odontopediatria',
          'Cirurgia e Traumatologia Bucomaxilofacial',
          'Prótese Dentária',
        ],
      },
      {
        professionName: 'Nutricionista',
        specialties: [
          'Nutrição Clínica',
          'Nutrição Esportiva',
          'Nutrição Funcional',
          'Nutrição Materno-Infantil',
          'Fitoterapia Aplicada à Nutrição',
        ],
      },
    ];

    for (const group of defaultSpecialtiesByProfession) {
      const profession = professionMap.get(group.professionName);
      if (!profession) continue;

      for (const specName of group.specialties) {
        const exists = await this.specialtyRepository.findOne({
          where: { profession_id: profession.id, name: specName },
        });
        if (!exists) {
          await this.specialtyRepository.save({
            name: specName,
            profession_id: profession.id,
            status: 'ACTIVE',
          });
        }
      }
    }

    this.logger.log('Seed de conselhos, profissões e especialidades verificado.');

    return {
      message: 'Seed concluído com sucesso!',
      client: {
        id: clinivaleClient.id,
        name: clinivaleClient.name,
      },
      role: {
        id: adminRole.id,
        name: adminRole.name,
        permissionsCount: permissions.length,
      },
      user: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
      },
    };
  }
}
