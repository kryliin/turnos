import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Espacio } from '../entities/espacio';
import { Tipo } from '../entities/tipo';
import { AbstractService } from './abstract.service';

@Injectable()
export class TipoService extends AbstractService<Tipo> {

    constructor(
        @InjectRepository(Tipo)
        private readonly tipoRepository: Repository<Tipo>) {
        super(tipoRepository);
    }

}
