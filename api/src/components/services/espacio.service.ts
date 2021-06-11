import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Espacio } from '../entities/espacio';
import { Tipo } from '../entities/tipo';
import { AbstractService } from './abstract.service';

@Injectable()
export class EspacioService extends AbstractService<Espacio> {

    constructor(
        @InjectRepository(Espacio)
        private readonly espacioRepository: Repository<Espacio>) {
        super(espacioRepository);
    }

    getEspaciosPorTipo(idTipo: number): Promise<Espacio[]> {
        try {
            return this.espacioRepository.createQueryBuilder('espacios')
                .innerJoin(Tipo, 'tipos', 'tipos.id = espacios.tipoId')
                .where('espacios.fechaBaja is null')
                .andWhere('espacios.tipoId = :idTipo', { idTipo })
                .orderBy('espacios.nombre', 'ASC')
                .getMany();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
