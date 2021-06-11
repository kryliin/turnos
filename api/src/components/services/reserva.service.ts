import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CancelarReservaRequest } from 'src/dto/reservas-playa/cancelar.reserva.request';
import { CancelarReservaResponse } from 'src/dto/reservas-playa/cancelar.reserva.response';
import { DisponibilidadEspaciosReseponse, DisponibilidadReseponse, DisponibilidadTurnosReseponse, SectoresReseponse } from 'src/dto/reservas-playa/disponibilidad.respone';
import { ReservaRequest } from 'src/dto/reservas-playa/reserva.request';
import { ReservaFiltros } from 'src/dto/reservas-playa/reseva.filtros';
import { ValidadorRequest } from 'src/dto/reservas-playa/validador.request';
import { CommonUtil } from 'src/utils/common.util';
import { Const } from 'src/utils/const';
import { DateUtil } from 'src/utils/date.util';
import { Repository } from 'typeorm';
import { Espacio } from '../entities/espacio';
import { Persona, TipoDocumento } from '../entities/persona';
import { Reserva } from '../entities/reserva';
import { Sector } from '../entities/sector';
import { Turno } from '../entities/turno';
import { AbstractService } from './abstract.service';
import { EspacioService } from './espacio.service';
import { ParametroService } from './parametro.service';
import { PersonaService } from './persona.service';
import { SectorService } from './sector.service';
import { TurnoService } from './turno.service';
import { DateUtils } from 'typeorm/util/DateUtils';
import { MailService } from "./mail.service";

@Injectable()
export class ReservaService extends AbstractService<Reserva> {

    isDebug = false;

    constructor(
        public authService: AuthService,
        private personaService: PersonaService,
        private sectorService: SectorService,
        private espacioService: EspacioService,
        private parametroService: ParametroService,
        private turnoService: TurnoService,
        private mailService: MailService,
        @InjectRepository(Reserva)
        private readonly reservaRepository: Repository<Reserva>) {
        super(reservaRepository);
    }


    async getAll(): Promise<Reserva[]> {
        try {
            const hoy: Date = DateUtils.mixedDateToDate(new Date(
                new Date(new Date()).getFullYear(),
                new Date(new Date()).getMonth(),
                new Date(new Date()).getDate()), false, false);

            return await this.reservaRepository.find({
                where: { fechaReserva: hoy }
            });


        } catch (error) {
            throw new BadGatewayException(error);
        }
    }


    public async reservar(reservaRequest: ReservaRequest): Promise<string> {
        let reservaReseponse: string;
        const fechaReserva = await this.obtenerValidarFechaReserva(reservaRequest.fechaReserva);
        const espacio = await this.obtenerValidarEspacio(reservaRequest.idEspacio);
        const sector = await this.obtenerValidarSector(reservaRequest.idSector);
        const turno = await this.obtenerValidarTurno(reservaRequest.idTurno);
        await this.validarTurnoEspacioSector(turno, espacio, sector);
        const personas = await this.obtenerValidarListaPersona(reservaRequest.listaDNI);
        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('fechaReserva ' + JSON.stringify(fechaReserva)) : '';
        this.isDebug ? console.log('espacio ' + JSON.stringify(espacio)) : '';
        this.isDebug ? console.log('sector ' + JSON.stringify(sector)) : '';
        this.isDebug ? console.log('turno ' + JSON.stringify(turno)) : '';
        this.isDebug ? console.log('personas ' + JSON.stringify(personas)) : '';

        if (personas) {
            let codigoReservaNueva = null;
            for (let persona of personas) {
                if (await this.validarExistenReservasPorPersonaParaFecha(persona.numeroDocumento, fechaReserva) > 0) {
                    const fechaBusqueda: Date = DateUtils.mixedDateToDate(new Date(
                        new Date(fechaReserva).getFullYear(),
                        new Date(fechaReserva).getMonth(),
                        new Date(fechaReserva).getDate()), false, false);
                    const mensaje = 'DNI ' + persona.numeroDocumento + ' ya posee una reserva para la fecha seleccionada';
                    this.isDebug ? console.log(mensaje) : '';
                    throw new InternalServerErrorException(mensaje);
                }
            }

            for (let persona of personas) {
                let entity = new Reserva(
                    reservaRequest.patente,
                    reservaRequest.correo,
                    reservaRequest.telefono,
                    fechaReserva,
                    persona,
                    sector,
                    null
                );
                // tslint:disable-next-line: no-console
                this.isDebug ? console.log('entity ' + JSON.stringify(entity)) : '';
                await super.create(entity).then(async created => {
                    // tslint:disable-next-line: no-console
                    this.isDebug ? console.log('created ' + JSON.stringify(created)) : '';

                    let reservaNueva = await this.get(created.id);
                    if (codigoReservaNueva === null) {
                        codigoReservaNueva = await this.generarCodigoReserva(reservaNueva.id);
                    }

                    reservaNueva.codigoReserva = codigoReservaNueva;
                    // tslint:disable-next-line: no-console
                    this.isDebug ? console.log('reservaNueva ' + JSON.stringify(reservaNueva)) : '';

                    super.update(reservaNueva);
                })
            }

            if (reservaRequest.correo) {
                const parametrosMail = {
                    participantes: personas.map((per, i) => {
                        return {
                            dni: per.numeroDocumento,
                            sexo: per.sexo.toLocaleUpperCase() == 'M' ? 'Masculino' : 'Femenino',
                            responsable: i == 0 ? ' <- Responsable' : ''
                        }
                    }),
                    mail: reservaRequest.correo,
                    codigo: codigoReservaNueva,
                    nombrePlaya: espacio.nombre,
                    fecha: fechaReserva.toISOString().substr(0, 10).split('-').reverse().join('/')
                }
                this.mailService.sendConfirmationMail(reservaRequest.correo, parametrosMail)
            }

            return codigoReservaNueva;

        } else {
            throw new InternalServerErrorException('Error al crear Personas');
        }

    }

    private async generarCodigoReserva(idReserva: number): Promise<string> {

        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('idReserva ' + JSON.stringify(idReserva)) : '';

        let codigoReserva: string = '';
        codigoReserva += CommonUtil.obtenerLetraRandom();
        codigoReserva += CommonUtil.obtenerLetraRandom();
        codigoReserva += CommonUtil.SEPADADOR;
        codigoReserva += '' + idReserva;

        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('codigoReserva ' + JSON.stringify(codigoReserva)) : '';

        return codigoReserva.toString();;
    }

    private async obtenerValidarEspacio(idEspacio: number): Promise<Espacio> {
        const espacio = await this.espacioService.get(idEspacio);
        if (espacio) {
            return espacio;
        } else {
            throw new InternalServerErrorException('Error al recuperar el Espacio');
        }
    }

    private async obtenerEspaciosPorTipo(idTipo: number): Promise<Espacio[]> {
        const espacios = await this.espacioService.getEspaciosPorTipo(idTipo);
        if (espacios) {
            return espacios;
        } else {
            throw new InternalServerErrorException('Error al recuperar lista de Espacios para el tipo: ' + idTipo);
        }
    }

    private async obtenerTurnosPorEspacio(idEspacio: number): Promise<Turno[]> {
        const turnos = await this.turnoService.getTurnosPorEspacio(idEspacio);
        if (turnos) {
            return turnos;
        } else {
            throw new InternalServerErrorException('Error al recuperar lista de Turnos para el Espacio: ' + idEspacio);
        }
    }

    private async obtenerSectoresPorEspacio(idEspacio: number): Promise<Sector[]> {
        const sectores = await this.sectorService.getSectoresPorEspacio(idEspacio);
        if (sectores) {
            return sectores;
        } else {
            throw new InternalServerErrorException('Error al recuperar lista de Sectores para el Espacio: ' + idEspacio);
        }
    }

    private async obtenerValidarSector(idSector: number): Promise<Sector> {
        const sector = await this.sectorService.get(idSector);
        if (sector) {
            return sector;
        } else {
            throw new InternalServerErrorException('Error al recuperar el Sector');
        }
    }

    private async obtenerValidarPersona(dni: string): Promise<Persona> {
        const persona = await this.personaService.getByDNI(dni);
        if (persona) {
            return persona;
        } else {
            throw new InternalServerErrorException('Error al recuperar la persona');
        }
    }

    private async obtenerValidarListaPersona(listaValidadorRequest: ValidadorRequest[]): Promise<Persona[]> {
        const cantidadReservasHabilitadas = + await this.parametroService.getValueByKey(Const.CANTIDAD_RESERVAS_POR_DNI);
        let listaPersonas: Persona[] = [];
        let errores: string[] = [];

        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('cantidadReservasHabilitadas ' + JSON.stringify(cantidadReservasHabilitadas)) : '';

        //listaValidadorRequest.forEach(async validadorRequest => {
        for (let i = 0; i < listaValidadorRequest.length; i++) {

            const validadorRequest = listaValidadorRequest[i];
            // tslint:disable-next-line: no-console
            this.isDebug ? console.log('validadorRequest ' + JSON.stringify(validadorRequest)) : '';

            const persona = await this.personaService.getByDNI(validadorRequest.dni);

            // tslint:disable-next-line: no-console
            this.isDebug ? console.log('persona ' + JSON.stringify(persona)) : '';

            if (!persona) {
                let persona = new Persona(
                    TipoDocumento.DNI,
                    validadorRequest.sexo,
                    validadorRequest.dni,
                    validadorRequest.numeroTramite
                );
                await this.personaService.create(persona);
                listaPersonas.push(persona);
            } else {

                const cantidadReservasHechas = await this.obtenerReservasPendientesPorPersona(validadorRequest.dni);

                // tslint:disable-next-line: no-console
                this.isDebug ? console.log('cantidadReservasHechas ' + JSON.stringify(cantidadReservasHechas)) : '';

                if (cantidadReservasHechas >= cantidadReservasHabilitadas) {
                    errores.push('DNI ' + validadorRequest.dni + ' supera cantidad máxima de reservas pendientes (' + cantidadReservasHabilitadas + '). Debe cancelar o ingresar en las fechas reservadas para volver a reservar.');
                } else {
                    listaPersonas.push(persona);
                }
            }
        }
        if (errores && errores.length > 0) {
            throw new InternalServerErrorException(errores);
        } else {
            // tslint:disable-next-line: no-console
            this.isDebug ? console.log('listaPersonas ' + JSON.stringify(listaPersonas)) : '';
            return listaPersonas;
        }
    }

    public async disponibilidadReservaPorDNI(dni: string): Promise<number> {
        const cantidadReservasHabilitadas = + await this.parametroService.getValueByKey(Const.CANTIDAD_RESERVAS_POR_DNI);
        const reservasPendientesPorPersona = await this.obtenerReservasPendientesPorPersona(dni);
        return cantidadReservasHabilitadas - reservasPendientesPorPersona;
    }

    private async obtenerReservasPendientesPorPersona(dni: string): Promise<number> {
        const persona = await this.personaService.getByDNI(dni);
        if (persona) {
            const dni = persona.numeroDocumento;
            const reservasPorDNI = await this.reservaRepository
                .createQueryBuilder('reservas')
                .innerJoin(Persona, "persona", "persona.id = reservas.personaId")
                .where('reservas.fechaBaja is null')
                .andWhere('reservas.fechaIngreso is null')
                .andWhere('persona.numeroDocumento = :dni', { dni })
                .orderBy('reservas.fechaReserva', 'ASC')
                .getMany() as Reserva[];
            if (reservasPorDNI) {
                return reservasPorDNI.length;
            } else {
                return 0;
            }

        } else {
            throw new InternalServerErrorException('Error al recuperar la persona');
        }
    }

    private async validarExistenReservasPorPersonaParaFecha(dni: string, fechaReserva: Date): Promise<number> {
        const fechaBusqueda: Date = DateUtils.mixedDateToDate(new Date(
            new Date(fechaReserva).getFullYear(),
            new Date(fechaReserva).getMonth(),
            new Date(fechaReserva).getDate()), false, false);
        const persona = await this.personaService.getByDNI(dni);
        if (persona) {
            const dni = persona.numeroDocumento;
            const reservasPorDNI = await this.reservaRepository
                .createQueryBuilder('reservas')
                .innerJoin(Persona, "persona", "persona.id = reservas.personaId")
                .where('reservas.fechaBaja is null')
                .andWhere('reservas.fechaIngreso is null')
                .andWhere('reservas.fechaReserva = :fechaBusqueda', { fechaBusqueda })
                .andWhere('persona.numeroDocumento = :dni', { dni })
                .orderBy('reservas.fechaReserva', 'ASC')
                .getMany() as Reserva[];
            if (reservasPorDNI) {
                return reservasPorDNI.length;
            } else {
                return 0;
            }
        } else {
            throw new InternalServerErrorException('Error al recuperar la persona');
        }
    }

    private async obtenerValidarFechaReserva(fechaReserva: Date): Promise<Date> {
        const hoy = new Date();
        const fechaReservaReturn = new Date(fechaReserva);
        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('fechaReserva ' + fechaReservaReturn) : '';
        this.isDebug ? console.log('hoy ' + hoy) : '';
        if (DateUtil.compareDateWithNotTime(fechaReservaReturn, hoy) >= 0) {
            return fechaReservaReturn;
        } else {
            throw new InternalServerErrorException('Error en la fecha de reserva');
        }
    }

    private async obtenerValidarTurno(idTurno: number): Promise<Turno> {
        const turno = this.turnoService.get(idTurno);
        if (turno) {
            return turno;
        } else {
            throw new InternalServerErrorException('Error al recuperar el turno');
        }
    }

    private async validarTurnoEspacioSector(turno: Turno, espacio: Espacio, sector: Sector): Promise<boolean> {
        if (turno.espacio.id === espacio.id) {
            if (sector.espacio.id === espacio.id) {
                return true;
            } else {
                throw new InternalServerErrorException('Error el sector seleccionado no correspode al espacio');
            }
        } else {
            throw new InternalServerErrorException('Error el turno seleccionado no correspode al espacio');
        }
    }


    public async obtenerReservasEntreFechas(cantidadDias: number): Promise<DisponibilidadReseponse[]> {

        let disponibilidadReseponseArray: DisponibilidadReseponse[] = [];
        let fechaInicial = new Date();
        let fechaFinal = new Date();


        fechaFinal.setDate(fechaFinal.getDate() + (+ cantidadDias));
        fechaInicial.setHours(0, 0, 0, 0);
        fechaFinal.setHours(0, 0, 0, 0);

        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('Obteniendo Espacios para el tipo ' + 1) : '';
        const espacios = await this.obtenerEspaciosPorTipo(1);

        const reservas = await this.reservaRepository
            .createQueryBuilder('reservas')
            .leftJoinAndSelect("reservas.sector", "sector")
            .where('reservas.fechaReserva >= :fechaInicial', { fechaInicial })
            .andWhere('reservas.fechaReserva <= :fechaFinal', { fechaFinal })
            .andWhere('reservas.fechaBaja is null')
            .orderBy('reservas.fechaReserva', 'ASC')
            .getMany();

        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('***************************************************************************') : '';
        this.isDebug ? console.log('Obteniendo Reservas') : '';
        this.isDebug ? console.log('***************************************************************************') : '';
        this.isDebug ? console.log('Obteniendo Reservas para las fechas ' + fechaInicial + ' / ' + fechaFinal) : '';
        this.isDebug ? console.log('Obteniendo Reservas para las fechas (date)' + fechaInicial.getDate() + ' / ' + fechaFinal.getDate()) : '';
        this.isDebug ? console.log('Reservas :' + JSON.stringify(reservas)) : '';
        this.isDebug ? console.log('***************************************************************************') : '';

        if (reservas && espacios) {
            // tslint:disable-next-line: no-console
            this.isDebug ? console.log('Iterando reservas') : '';
            for (let i = 0; i < cantidadDias; i++) {

                let disponibilidadReseponse = new DisponibilidadReseponse();
                disponibilidadReseponse.cantidadTotalReservas = reservas.length;

                let auxFecha = new Date(Date.now() - (new Date).getTimezoneOffset());
                auxFecha.setDate(auxFecha.getDate() + i)

                disponibilidadReseponse.fecha = new Date(auxFecha.getFullYear(), auxFecha.getMonth(), auxFecha.getDate());

                // tslint:disable-next-line: no-console
                this.isDebug ? console.log('Iterando espacios') : '';
                for (const espacio of espacios) {
                    let disponibilidadEspaciosReseponse = new DisponibilidadEspaciosReseponse();
                    disponibilidadEspaciosReseponse.nombre = espacio.nombre;
                    disponibilidadReseponse.listaEspacios.push(disponibilidadEspaciosReseponse);

                    // tslint:disable-next-line: no-console
                    this.isDebug ? console.log('Obteniendo Turnos para el espacio ' + espacio.id) : '';
                    const turnos = await this.obtenerTurnosPorEspacio(espacio.id);

                    // tslint:disable-next-line: no-console
                    this.isDebug ? console.log('Iterando turnos') : '';
                    for (const turno of turnos) {
                        let disponibilidadTurnosReseponse = new DisponibilidadTurnosReseponse();
                        disponibilidadTurnosReseponse.idTurno = turno.id;
                        disponibilidadTurnosReseponse.nombre = turno.nombre;

                        // tslint:disable-next-line: no-console
                        this.isDebug ? console.log('Obteniendo Sectores para el espacio ' + espacio.id) : '';
                        const sectores = await this.obtenerSectoresPorEspacio(espacio.id) as Sector[];

                        // tslint:disable-next-line: no-console
                        this.isDebug ? console.log('Sectores: ' + sectores) : '';

                        let cupo = 0;
                        let cantidadReservas = 0;
                        let ingresos = 0;
                        // tslint:disable-next-line: no-console
                        this.isDebug ? console.log('Iterando sectores') : '';

                        for (const sector of sectores) {
                            cupo += sector.cupoMaximo;
                            ingresos += await this.cantidadIngresados(reservas, disponibilidadReseponse.fecha, sector.id);
                            cantidadReservas += await this.cantidadReservas(reservas, disponibilidadReseponse.fecha, sector.id);
                            let sectoresReseponse = new SectoresReseponse();
                            sectoresReseponse.idSector = sector.id;
                            sectoresReseponse.nombre = sector.nombre;
                            disponibilidadEspaciosReseponse.listaSectores.push(sectoresReseponse);
                        }
                        disponibilidadTurnosReseponse.cupoMaximo = cupo;
                        disponibilidadTurnosReseponse.cantidadReservas = cantidadReservas;
                        disponibilidadTurnosReseponse.cantidadIngresados = ingresos;
                        disponibilidadEspaciosReseponse.listaTurnos.push(disponibilidadTurnosReseponse);
                        this.isDebug ? console.log(disponibilidadEspaciosReseponse) : '';
                    }
                }
                // tslint:disable-next-line: no-console
                this.isDebug ? console.log('Agregando disponibilidadReseponse al Array') : '';
                disponibilidadReseponseArray.push(disponibilidadReseponse);

                // tslint:disable-next-line: no-console
                this.isDebug ? console.log('************ ITREACION: ' + disponibilidadReseponseArray.length + ' ************') : '';
            }
        }
        return disponibilidadReseponseArray;
    }


    private async cantidadReservas(reservas: Reserva[], fecha: Date, idSector: number): Promise<number> {
        let cantidad = 0;
        reservas.forEach(reserva => {

            // tslint:disable-next-line: no-console
            this.isDebug ? console.log('Comparando Fecha Reserva: ' + reserva.fechaReserva) : '';
            this.isDebug ? console.log('Comparando Fecha Busqueda: ' + fecha) : '';
            this.isDebug ? console.log('Reserva ' + JSON.stringify(reserva)) : '';

            if (DateUtil.compareDateIndividualWithNotTime(reserva.fechaReserva, fecha) && reserva.sector.id === idSector) {
                cantidad++;
            }
        });
        return cantidad;
    }


    private async cantidadIngresados(reservas: Reserva[], fecha: Date, idSector: number): Promise<number> {

        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('***************************************************************************') : '';
        this.isDebug ? console.log('Clase: ReservaService.') : '';
        this.isDebug ? console.log('Metodo: cantidadIngresados.') : '';
        this.isDebug ? console.log('***************************************************************************') : '';
        this.isDebug ? console.log('Comparando Fecha Busqueda: ' + fecha) : '';


        let auxFecha = new Date(fecha.getDate() - (new Date).getTimezoneOffset());

        const fechaBuscada = new Date(auxFecha.getFullYear(), auxFecha.getMonth(), auxFecha.getDate());

        let cantidad = 0;
        reservas.forEach(reserva => {

            // tslint:disable-next-line: no-console
            this.isDebug ? console.log('DateUtil.compareDateWithNotTime: ' + DateUtil.compareDateIndividualWithNotTime(reserva.fechaReserva, fechaBuscada)) : '';

            if (DateUtil.compareDateIndividualWithNotTime(reserva.fechaReserva, fecha) == true
                && reserva.sector.id === idSector && reserva.fechaIngreso) {
                // tslint:disable-next-line: no-console
                this.isDebug ? console.log('Comparando Fecha Reserva: ' + reserva.fechaReserva) : '';
                cantidad++;
            }
        });
        this.isDebug ? console.log('***************************************************************************') : '';
        return cantidad;
    }

    public async findByFiltros(filtros: ReservaFiltros): Promise<Reserva[]> {
        const idSector = filtros.idSector;
        const dni = filtros.numeroDocumento;
        let codigoReserva = filtros.codigoReserva;

        const fechaBusqueda: Date = DateUtils.mixedDateToDate(new Date(
            new Date(filtros.fecha).getFullYear(),
            new Date(filtros.fecha).getMonth(),
            new Date(filtros.fecha).getDate()), false, false);

        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('DNI: ' + dni) : '';
        this.isDebug ? console.log('fechaBusqueda: ' + fechaBusqueda) : '';
        this.isDebug ? console.log('fechaFront: ' + filtros.fecha) : '';

        let reservasPorDNI: Reserva[];

        // Filtra por: Fecha, Sector y DNI
        if (!codigoReserva && filtros.idSector && filtros.idSector >= 0) {

            reservasPorDNI = await this.reservaRepository
                .createQueryBuilder('reservas')
                .innerJoin(Sector, "sector", "sector.id = reservas.sectorId")
                .innerJoin(Persona, "persona", "persona.id = reservas.personaId")
                .where('reservas.fechaBaja is null')
                .andWhere('reservas.fechaIngreso is null')
                .andWhere('persona.numeroDocumento = :dni', { dni })
                .andWhere('sector.id = :idSector', { idSector })
                .andWhere('reservas.fechaReserva = :fechaBusqueda', { fechaBusqueda })
                .orderBy('reservas.fechaReserva', 'ASC')
                .getMany() as Reserva[];

            // Filtra por: codigoReserva
        } else if (codigoReserva) {
            reservasPorDNI = await this.reservaRepository
                .createQueryBuilder('reservas')
                .innerJoin(Persona, "persona", "persona.id = reservas.personaId")
                .where('reservas.fechaBaja is null')
                .andWhere('reservas.fechaIngreso is null')
                .andWhere('reservas.codigoReserva = :codigoReserva', { codigoReserva })
                .orderBy('reservas.fechaReserva', 'ASC')
                .getMany() as Reserva[];
        }

        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('reservasPorDNI : ' + JSON.stringify(reservasPorDNI)) : '';

        // Obtengo el codigo de reserva para ese filtro
        if (reservasPorDNI) {
            reservasPorDNI.forEach(reserva => {
                codigoReserva = reserva.codigoReserva as string;
            });
        }

        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('codigoReserva: ' + codigoReserva) : '';

        // Retorno todas las reservas no canceladas y sin ingresas segun codigo reserva
        return await this.reservaRepository.find({
            where: { codigoReserva: codigoReserva, fechaIngreso: null, fechaBaja: null }
        });
    }

    public async validar(validadorRequest: ValidadorRequest): Promise<string> {
        if (validadorRequest.dni && validadorRequest.sexo) {
            let persona;
            let numeroTramite = '0';
            if (CommonUtil.validaDNI(validadorRequest.dni) && CommonUtil.validaSexo(validadorRequest.sexo)) {
                persona = await this.personaService.getByDNI(validadorRequest.dni);
                if (persona) {
                    return await this.authService.signInTokenPublic(persona.numeroDocumento);
                } else {
                    if (validadorRequest.numeroTramite) {
                        numeroTramite = validadorRequest.numeroTramite
                    }
                    let personaNew = new Persona(
                        TipoDocumento.DNI,
                        validadorRequest.sexo,
                        validadorRequest.dni,
                        numeroTramite);
                    persona = await this.personaService.create(personaNew);
                    return this.validar(validadorRequest);
                }
            } else {
                throw new BadRequestException('DNI o Sexo incorrecto');
            }
        } else {
            throw new BadRequestException('DNI y Sexo son obligatorios');
        }
    }

    public checkIn(reservas: Reserva[]): Reserva[] | Promise<Reserva[]> {
        let reservasActualizadas: Reserva[] = [];

        const hoy = (new Date()).toISOString();

        for (let reserva of reservas) {

            const fechaReserva = (new Date(reserva.fechaReserva)).toISOString();

            // tslint:disable-next-line: no-console
            this.isDebug ? console.log('reserva.fechaReserva ' + JSON.stringify(reserva.fechaReserva)) : '';
            this.isDebug ? console.log('fechaReserva ' + JSON.stringify(fechaReserva)) : '';
            this.isDebug ? console.log('reserva.fechaReserva normalizada' + JSON.stringify(new Date(reserva.fechaReserva).toISOString())) : '';
            this.isDebug ? console.log('hoy ' + JSON.stringify(hoy)) : '';

            if (fechaReserva === hoy) {
                throw new BadRequestException('No se pueden registrar ingresos para las fechas');
            }
        }

        for (let reserva of reservas) {
            this.get(reserva.id)
                .then(object => {
                    object.fechaIngreso = new Date();
                    object.usuario = reserva.usuario;
                    this.update(object);
                    reservasActualizadas.push(object);
                });
        }
        return reservasActualizadas;
    }

    public async cancelar(cancelarReservaRequest: CancelarReservaRequest): Promise<CancelarReservaResponse> {

        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('validacion DNI: ' + CommonUtil.validaDNI(cancelarReservaRequest.dni)) : '';
        this.isDebug ? console.log('validacion Codigo Reserva: ' + CommonUtil.validaCodigoReserva(cancelarReservaRequest.codigoReserva)) : '';

        if (cancelarReservaRequest.dni && cancelarReservaRequest.codigoReserva
            && (CommonUtil.validaDNI(cancelarReservaRequest.dni)
                && CommonUtil.validaCodigoReserva(cancelarReservaRequest.codigoReserva))) {

            // tslint:disable-next-line: no-console
            this.isDebug ? console.log('cancelarReservaRequest: ' + cancelarReservaRequest) : '';

            const reservas = await this.buscarReservasPorCodigo(cancelarReservaRequest.codigoReserva);
            let response = new CancelarReservaResponse();

            if (this.existeDniEnReservas(reservas, cancelarReservaRequest.dni)) {
                let mailParams = null;
                reservas.forEach(reserva => {
                    if (!mailParams) {
                        mailParams = {
                            codigo: reserva.codigoReserva,
                            fecha: reserva.fechaReserva.toString().split('-').reverse().join('/'),
                            mail: reserva.correo
                        }
                    }
                    reserva.fechaBaja = new Date();
                    this.update(reserva);
                });
                response.reservasCanceladas = reservas.length;
                if (mailParams.mail) {
                    this.mailService.sendCancellationMail(mailParams.mail, mailParams)
                }
                return response;
            }

            // tslint:disable-next-line: no-console
            this.isDebug ? console.log('DNI no encontrado entre las reservas. ') : '';
        }
        throw new BadRequestException('DNI y/o Codigo de Reserva son incorrectos');
    }

    private existeDniEnReservas(reservas: Reserva[], dni: string) {
        // tslint:disable-next-line: no-console
        this.isDebug ? console.log('DNI Buscado : ' + JSON.stringify(dni)) : '';

        for (let reserva of reservas) {
            this.isDebug ? console.log('DNI Reserva : ' + JSON.stringify(reserva.persona.numeroDocumento)) : '';

            // this.isDebug ? console.log('Compare : ' + (reserva.persona.numeroDocumento == dni)) : '';
            // this.isDebug ? console.log('Compare : ' + (reserva.persona.numeroDocumento === dni)) : '';

            if (reserva.persona.numeroDocumento == dni) {
                return true
            };
        }

        return false;
    }

    public async buscarReservasPorCodigo(codigoReserva: string): Promise<Reserva[]> {
        return await this.reservaRepository
            .createQueryBuilder('reservas')
            .leftJoinAndSelect("reservas.sector", "sector")
            .leftJoinAndSelect("reservas.persona", "persona")
            .where('reservas.fechaBaja is null')
            .andWhere('reservas.codigoReserva = :codigoReserva', { codigoReserva })
            .orderBy('reservas.fechaReserva', 'ASC')
            .getMany();
    }

    public async listadoDNI(idEspacio): Promise<string[]> {
        let auxFecha = new Date(Date.now() - (new Date).getTimezoneOffset());
        const fechaReserva = new Date(auxFecha.getFullYear(), auxFecha.getMonth(), auxFecha.getDate());
        let listaDNI = [];
        const reservas = await this.reservaRepository
            .createQueryBuilder('reservas')
            .leftJoinAndSelect("reservas.persona", "persona")
            .where('reservas.fechaBaja is null')
            .andWhere('reservas.fechaIngreso is null')
            .andWhere('reservas.fechaReserva = :fechaReserva', { fechaReserva })
            .getMany();

        this.isDebug ? console.log('reservas : ' + JSON.stringify(reservas)) : '';

        for (let reserva of reservas) {
            listaDNI.push(reserva.persona.numeroDocumento);
        }
        this.isDebug ? console.log('listaDNI : ' + JSON.stringify(listaDNI)) : '';
        return listaDNI.sort((a, b) => {
            return a - b;
        });
    }

}
