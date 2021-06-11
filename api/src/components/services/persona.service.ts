import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Persona } from '../entities/persona';
import { AbstractService } from './abstract.service';

@Injectable()
export class PersonaService extends AbstractService<Persona> {

    constructor(
        @InjectRepository(Persona)
        private readonly personaRepository: Repository<Persona>) {
        super(personaRepository);
    }

    async getByDNI(dni: string): Promise<Persona> {
        try {
            const persona = await this.personaRepository.findOne({ where: { numeroDocumento: dni } });
            return persona as Persona;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

}
