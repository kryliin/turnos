import { BadGatewayException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AbstractEntity } from '../entities/abstract-entity';
import { IAbstractService } from './iabstract';

@Injectable()
export abstract class AbstractService<T extends AbstractEntity> implements IAbstractService<T> {

    constructor(private readonly genericRepository: Repository<T>) { }

    create(entity: any): Promise<any> {
        try {
            entity.version = 1;
            entity.fechaAlta = new Date();
            return new Promise<number>((resolve, reject) => {
                this.genericRepository.save(entity)
                    .then(created => resolve(created))
                    .catch(err => reject(err));
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    getAll(): Promise<T[]> {
        try {
            return this.genericRepository.find() as Promise<T[]>;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    get(id: number): Promise<T> {
        try {
            return this.genericRepository.findOne(id) as Promise<T>;
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    delete(id: number) {
        try {
            this.get(id).then(object => {
                this.genericRepository.remove(object);
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }

    update(entity: any): Promise<any> {
        try {
            entity.fechaModificacion = new Date();
            return new Promise<any>((resolve, reject) => {
                this.genericRepository.findOne(entity.id)
                    .then(responseGet => {
                        try {
                            if (responseGet == null) { reject('Not existing'); }
                            const retrievedEntity: any = entity as any;
                            this.genericRepository.save(retrievedEntity)
                                .then(response => resolve(response))
                                .catch(err => reject(err));
                        } catch (e) {
                            reject(e);
                        }
                    })
                    .catch(err => reject(err));
            });
        } catch (error) {
            throw new BadGatewayException(error);
        }
    }
}