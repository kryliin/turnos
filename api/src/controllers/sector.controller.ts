import { Controller } from '@nestjs/common';
import { Sector } from 'src/components/entities/sector';
import { SectorService } from 'src/components/services/sector.service';
import { AbstractController } from './abstract.controller';

@Controller('sector')
export class SectorController extends AbstractController<Sector> {

    constructor(private readonly sectorService: SectorService) {
        super(sectorService);
    }
}
