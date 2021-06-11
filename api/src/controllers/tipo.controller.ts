import { Controller } from '@nestjs/common';
import { Tipo } from 'src/components/entities/tipo';
import { TipoService } from 'src/components/services/tipo.service';
import { AbstractController } from './abstract.controller';

@Controller('tipo')
export class TipoController extends AbstractController<Tipo> {

    constructor(private readonly tipoService: TipoService) {
        super(tipoService);
    }
}
