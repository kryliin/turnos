import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy'
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../config/config.service';
import { ConfigModule } from '../config/config.module';
import { UsuarioService } from '../components/services/usuario.service';
import { CsvModule } from 'nest-csv-parser';
import { Usuario } from 'src/components/entities/usuario';
import { RoleService } from 'src/components/services/role.service';
import { Role } from 'src/components/entities/role';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ConfigService, JwtStrategy, UsuarioService, RoleService],
  exports: [JwtStrategy, PassportModule, AuthService, JwtModule],
  imports: [CsvModule,
    TypeOrmModule.forFeature([Usuario, Role]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          secret: 'JWT_SECRET',
          signOptions: {
            expiresIn: '100y'
          },
        };
      },
    }),
  ],
})
export class AuthModule { }
