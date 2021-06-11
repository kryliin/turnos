import { Controller, Get, Post, Put, Delete, Param, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ParametroService } from '../components/services/parametro.service';
import { AbstractController } from './abstract.controller';
import { Parametro } from 'src/components/entities/paramtro';

@Controller('parametros')
export class ParametroController extends AbstractController<Parametro> {

    constructor(private readonly parametroService: ParametroService) {
        super(parametroService);
    }

}