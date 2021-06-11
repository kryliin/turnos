import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { ConfigService } from '../config/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JWT_SECRET'
    });
  }

  async validate(payload: UserDto) {
    /*
    const { dni } = payload;
    const user = await this.authRepo.findOne({
      where: { dni: dni }
    });

    if (!user) {
      throw new UnauthorizedException();
    }*/

    return payload
  }

}