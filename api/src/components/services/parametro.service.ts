import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Parametro } from '../entities/paramtro';
import { AbstractService } from './abstract.service';

@Injectable()
export class ParametroService extends AbstractService<Parametro> {

    constructor(
        @InjectRepository(Parametro)
        private readonly parametroRepository: Repository<Parametro>) {
        super(parametroRepository);
    }

    async getValueByKey(key: string): Promise<string> {
        if (key) {
            const parametro = await this
                .parametroRepository.findOne({ where: { key: key } }) as Parametro;
            if (parametro && parametro.value) {
                return parametro.value;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

}
