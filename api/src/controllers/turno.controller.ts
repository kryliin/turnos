import { Controller } from '@nestjs/common';
import { Turno } from 'src/components/entities/turno';
import { TurnoService } from 'src/components/services/turno.service';
import { AbstractController } from './abstract.controller';

@Controller('turno')
export class TurnoController extends AbstractController<Turno> {

    constructor(private readonly turnoService: TurnoService) {
        super(turnoService);
    }

}
