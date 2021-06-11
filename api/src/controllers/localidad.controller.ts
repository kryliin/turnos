import { Controller } from '@nestjs/common';
import { LocalidadService } from '../components/services/localidad.service';
import { AbstractController } from './abstract.controller';
import { Localidad } from 'src/components/entities/localidad';

@Controller('localidades')
export class LocalidadController extends AbstractController<Localidad> {

    constructor(private readonly localidadService: LocalidadService) {
        super(localidadService);
    }

}
