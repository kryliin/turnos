import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Persona } from 'src/components/entities/persona';
import { PersonaService } from 'src/components/services/persona.service';
import { AbstractController } from './abstract.controller';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('persona')
export class PersonaController extends AbstractController<Persona> {

    constructor(private readonly personaService: PersonaService) {
        super(personaService);
    }

    @Get('/dni/:dni')
    @ApiResponse({ status: 200, description: 'Entity retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Entity does not exist' })
    //@UseGuards(new AuthGuard())
    async findByDNI(@Param('dni') dni: string): Promise<Persona> {
        return this.personaService.getByDNI(dni);
    }
}
