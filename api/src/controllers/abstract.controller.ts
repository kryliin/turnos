import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { IAbstractService } from 'src/components/services/iabstract';
import { ApiResponse } from '@nestjs/swagger';
import { AbstractEntity } from 'src/components/entities/abstract-entity';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller()
export class AbstractController<T extends AbstractEntity> {

    constructor(private readonly IBaseService: IAbstractService<T>) { }

    @Get()
    @ApiResponse({ status: 200, description: 'Ok' })
    // @UseGuards(new AuthGuard())
    async findAll(): Promise<T[]> {
        return this.IBaseService.getAll();
    }

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Entity retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Entity does not exist' })
    //@UseGuards(new AuthGuard())
    async findById(@Param('id') id: number): Promise<T> {
        return this.IBaseService.get(id);
    }

    @Post()
    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    // @UseGuards(new AuthGuard())
    async create(@Body() entity: T): Promise<number> {
        return this.IBaseService.create(entity);
    }

    @Delete(':id')
    @ApiResponse({ status: 200, description: 'Entity deleted successfully.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    //@UseGuards(new AuthGuard())
    async delete(@Param('id') id: number) {
        this.IBaseService.delete(id);
    }

    @Put()
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    @ApiResponse({ status: 200, description: 'Entity deleted successfully.' })
    //@UseGuards(new AuthGuard())
    async update(@Body() entity: T): Promise<T> {
        return this.IBaseService.update(entity);
    }

}
