
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as config from '../config/config.keys';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }
    request.access = await this.validateToken(request.headers.authorization);
    return true;
  }

  async validateToken(auth: String) {
    if (auth.split(' ')[0] != 'Bearer') {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];
    try {
      const decoded = await jwt.verify(token, config.Configuration.JWT_SECRET);
      return decoded;
    } catch (err) {
      const message = 'Error de Token: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.UNAUTHORIZED)
    }
  }
}
