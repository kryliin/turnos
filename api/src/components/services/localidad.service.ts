import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Localidad } from '../entities/localidad';
import { AbstractService } from './abstract.service';

@Injectable()
export class LocalidadService extends AbstractService<Localidad> {

    constructor(
        @InjectRepository(Localidad)
        private readonly localidadRepository: Repository<Localidad>) {
        super(localidadRepository);
    }

}
