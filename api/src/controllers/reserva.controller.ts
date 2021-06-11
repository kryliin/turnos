import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Reserva } from 'src/components/entities/reserva';
import { ReservaService } from 'src/components/services/reserva.service';
import { CancelarReservaRequest } from 'src/dto/reservas-playa/cancelar.reserva.request';
import { CancelarReservaResponse } from 'src/dto/reservas-playa/cancelar.reserva.response';
import { DisponibilidadReseponse } from 'src/dto/reservas-playa/disponibilidad.respone';
import { ReservaRequest } from 'src/dto/reservas-playa/reserva.request';
import { ReservaFiltros } from 'src/dto/reservas-playa/reseva.filtros';
import { ValidadorRequest } from 'src/dto/reservas-playa/validador.request';
import { AbstractController } from './abstract.controller';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('reserva')
export class ReservaController extends AbstractController<Reserva> {

    constructor(private readonly reservaService: ReservaService) {
        super(reservaService);
    }

    @Post('/playa/reservar')
    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    // @UseGuards(new AuthGuard())
    async reserva(@Body() reservaRequest: ReservaRequest): Promise<string> {
        return this.reservaService.reservar(reservaRequest);
    }

    @Get('/playa/:cantidadDias')
    @ApiResponse({ status: 200, description: 'Ok' })
    async obtenerReservasEntreFechas(@Param('cantidadDias') cantidadDias: number): Promise<DisponibilidadReseponse[]> {
        return this.reservaService.obtenerReservasEntreFechas(cantidadDias);
    }

    @Get('/playa/disponibilidad-dni/:dni')
    @ApiResponse({ status: 200, description: 'Ok' })
    //@UseGuards(new AuthGuard())
    async disponibilidadReservaPorDNI(@Param('dni') dni: string): Promise<number> {
        return this.reservaService.disponibilidadReservaPorDNI(dni);
    }

    @Get('/playa/listado-dni/:idEspacio')
    @ApiResponse({ status: 200, description: 'Ok' })
    async listadoDNI(@Param('idEspacio') idEspacio: number): Promise<string[]> {
        return this.reservaService.listadoDNI(idEspacio);
    }

    @Post('/playa/validar')
    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    // @UseGuards(new AuthGuard())
    async validar(@Body() validadorRequest: ValidadorRequest): Promise<string> {
        return this.reservaService.validar(validadorRequest);
    }

    @Post('/playa/filtros')
    @ApiResponse({ status: 200, description: 'Entity retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Entity does not exist' })
    //@UseGuards(new AuthGuard())
    async findByFiltros(@Body() filtros: ReservaFiltros): Promise<Reserva[]> {
        return this.reservaService.findByFiltros(filtros);
    }

    @Post('/playa/checkin')
    @ApiResponse({ status: 200, description: 'Entity retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Entity does not exist' })
    //@UseGuards(new AuthGuard())
    async checkIn(@Body() reservas: Reserva[]): Promise<Reserva[]> {
        return this.reservaService.checkIn(reservas);
    }

    @Post('/playa/cancelar')
    @ApiResponse({ status: 200, description: 'Entity deleted successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async cancelar(@Body() cancelarReservaRequest: CancelarReservaRequest): Promise<CancelarReservaResponse> {
        return this.reservaService.cancelar(cancelarReservaRequest);
    }

}
