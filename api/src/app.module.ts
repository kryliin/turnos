import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { MulterModule } from '@nestjs/platform-express/multer';
import { Usuario } from './components/entities/usuario';
import { CsvModule } from 'nest-csv-parser';
import { Espacio } from './components/entities/espacio';
import { Localidad } from './components/entities/localidad';
import { Persona } from './components/entities/persona';
import { Reserva } from './components/entities/reserva';
import { Sector } from './components/entities/sector';
import { Tipo } from './components/entities/tipo';
import { Turno } from './components/entities/turno';
import { TurnoController } from './controllers/turno.controller';
import { TurnoService } from './components/services/turno.service';
import { EspacioController } from './controllers/espacio.controller';
import { LocalidadController } from './controllers/localidad.controller';
import { ParametroController } from './controllers/parametro.controller';
import { PersonaController } from './controllers/persona.controller';
import { ReservaController } from './controllers/reserva.controller';
import { SectorController } from './controllers/sector.controller';
import { TipoController } from './controllers/tipo.controller';
import { UsuarioController } from './controllers/usuario.controller';
import { EspacioService } from './components/services/espacio.service';
import { LocalidadService } from './components/services/localidad.service';
import { ParametroService } from './components/services/parametro.service';
import { PersonaService } from './components/services/persona.service';
import { ReservaService } from './components/services/reserva.service';
import { TipoService } from './components/services/tipo.service';
import { UsuarioService } from './components/services/usuario.service';
import { Parametro } from './components/entities/paramtro';
import { SectorService } from './components/services/sector.service';
import { Role } from './components/entities/role';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from "./components/services/mail.service";
import { RoleService } from './components/services/role.service';
import { AlumnosUtn } from '../../panel/src/app/models/alumnosutn';
import { AlumnosUtnontroller } from './controllers/alumnosutn.controller';
import { AlumnosUtnService } from './components/services/alumnosutn.service';




@Module({
  imports: [
    CsvModule,
    HttpModule,
    AuthModule,
    ConfigModule,
    MulterModule.register(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      // password: 'turnos#2021MCU',
      // password: 'hola123',
      password: '36418655',
      database: 'turnos',
      entities: [
        Espacio,
        Localidad,
        Persona,
        Reserva,
        Sector,
        Tipo,
        Turno,
        Parametro,
        Usuario,
        Role,
        AlumnosUtn,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Espacio,
      Localidad,
      Persona,
      Reserva,
      Sector,
      Tipo,
      Turno,
      Usuario,
      Parametro,
      Role,
      AlumnosUtn,
    ]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.btrhosting.com.ar',
        port: 465,
        ignoreTLS: true,
        secure: false,
        auth: {
          user: 'reservas@cdeluruguay.gob.ar',
          pass: 'Lwzd<pPC+M',
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        adapter: new HandlebarsAdapter(),
        dir: process.cwd() + '/templates/',
      },
    }),
  ],
  controllers: [
    AppController, TurnoController, EspacioController, LocalidadController, ParametroController,
    PersonaController, ReservaController, SectorController, TipoController, UsuarioController, AlumnosUtnontroller
  ],
  providers: [
    AppService, TurnoService, EspacioService, LocalidadService, ParametroService, RoleService,
    PersonaService, ReservaService, SectorService, TipoService, UsuarioService, MailService, AlumnosUtnService
  ],
})
export class AppModule { }
