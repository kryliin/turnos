import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AlumnosUtn } from 'src/components/entities/alumnosutn';
import { AbstractController } from './abstract.controller';
import { AlumnosUtnService } from 'src/components/services/alumnosutn.service';


@Controller('alumnosutn')
export class AlumnosUtnontroller {

    constructor(private readonly alumnosUtnService: AlumnosUtnService) {
    }

    @Get('/dni/:dni')
    @ApiResponse({ status: 200, description: 'Entity retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Entity does not exist' })

    async findByDNI(@Param('dni') dni: string): Promise<AlumnosUtn> {
        return this.alumnosUtnService.getByDNI(dni);
    }
}