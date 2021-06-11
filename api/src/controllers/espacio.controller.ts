import { Controller } from '@nestjs/common';
import { Espacio } from 'src/components/entities/espacio';
import { EspacioService } from 'src/components/services/espacio.service';
import { AbstractController } from './abstract.controller';

@Controller('espacio')
export class EspacioController extends AbstractController<Espacio> {

    constructor(private readonly espacioService: EspacioService) {
        super(espacioService);
    }

}
