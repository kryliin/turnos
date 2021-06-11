import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Espacio } from '../entities/espacio';
import { Turno } from '../entities/turno';
import { AbstractService } from './abstract.service';

@Injectable()
export class TurnoService extends AbstractService<Turno> {

    constructor(
        @InjectRepository(Turno)
        private readonly turnoRepository: Repository<Turno>) {
        super(turnoRepository);
    }

    getTurnosPorEspacio(idEspacio: number) {
        try {
            return this.turnoRepository.createQueryBuilder('turnos')
                .innerJoin(Espacio, 'espacios', 'espacios.id = turnos.espacioId')
                .where('turnos.fechaBaja is null')
                .andWhere('turnos.espacioId = :idEspacio', { idEspacio })
                .orderBy('turnos.nombre', 'ASC')
                .getMany();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

}
