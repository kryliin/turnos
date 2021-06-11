import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlumnosUtn } from '../entities/alumnosutn';


@Injectable()
export class AlumnosUtnService {

    constructor(
        @InjectRepository(AlumnosUtn)
        private readonly alumnosutnepository: Repository<AlumnosUtn>) {
    }

    async getByDNI(dni: string): Promise<AlumnosUtn> {
    
        try {
            const alumno = await this.alumnosutnepository.findOne({ where: { dni: dni } });
            return alumno as AlumnosUtn;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

}