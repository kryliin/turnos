import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Espacio } from '../entities/espacio';
import { Sector } from '../entities/sector';
import { AbstractService } from './abstract.service';

@Injectable()
export class SectorService extends AbstractService<Sector> {

    constructor(
        @InjectRepository(Sector)
        private readonly sectorRepository: Repository<Sector>) {
        super(sectorRepository);
    }

    getSectoresPorEspacio(idEspacio: number): Promise<Sector[]> {
        try {
            return this.sectorRepository.createQueryBuilder('sectores')
                .innerJoin(Espacio, 'espacios', 'espacios.id = sectores.espacioId')
                .where('sectores.fechaBaja is null')
                .andWhere('sectores.espacioId = :idEspacio', { idEspacio })
                .orderBy('sectores.nombre', 'ASC')
                .getMany();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
