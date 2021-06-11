import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role';
import { AbstractService } from './abstract.service';

@Injectable()
export class RoleService extends AbstractService<Role> {

    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>) {
        super(roleRepository);
    }

}
