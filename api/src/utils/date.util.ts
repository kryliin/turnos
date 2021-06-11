import { DeleteQueryBuilder } from "typeorm";
import {type} from "os";

export class DateUtil {


    public static sumarDias(fechaInicial: Date, cantidadDias: number): Date {

        let fechaFinal = new Date();
        fechaInicial.setHours(0, 0, 0, 0);
        fechaFinal.setHours(0, 0, 0, 0);
        fechaFinal.setDate(fechaInicial.getDate() + cantidadDias);
        return fechaFinal;
    }


    public static compareDate(date1: Date, date2: Date): number {
        let d1 = new Date(date1);
        let d2 = new Date(date2);

        // Check if the dates are equal
        let same = d1.getTime() === d2.getTime();
        if (same) return 0;

        // Check if the first is greater than second
        if (d1 > d2) return 1;

        // Check if the first is less than second
        if (d1 < d2) return -1;
    }

    public static compareDateWithNotTime(date1: Date, date2: Date): number {
        let d1 = new Date(date1);
        let d2 = new Date(date2);

        d1.setHours(0, 0, 0, 0);
        d2.setHours(0, 0, 0, 0);

        return this.compareDate(d1, d2);
    }


    public static compareDateIndividualWithNotTime(fechaInicial: Date, fechaFin: Date): boolean {

        if (typeof fechaInicial == 'string'){
            fechaInicial = new Date(Date.parse(fechaInicial+'T03:00:00.000Z'));
        }
        // const auxFecha = new Date(fechaInicial.getDate() - (new Date).getTimezoneOffset());
        // const fechaBuscada = new Date(auxFecha.getFullYear(), auxFecha.getMonth(), auxFecha.getDate());

        // console.log('fechaInicial : ' + fechaBuscada);
        // console.log('fechaFin:  ' + fechaFin);

        //d1.setHours(0, 0, 0, 0);
        //d2.setHours(0, 0, 0, 0);

        // tslint:disable-next-line: no-console
        // console.log('fechaInicial.getFullYear() ' + fechaInicial.getFullYear() + '  fechaBuscada.getFullYear() ' + fechaBuscada.getFullYear());

        // console.log('fechaInicial.getMonth() ' + fechaInicial.getMonth() + '  fechaBuscada.getMonth() ' + fechaBuscada.getMonth());

        // console.log('fechaInicial.getDate() ' + fechaInicial.getDate() + '  fechaBuscada.getDate() ' + fechaBuscada.getDate());

        // console.log(fechaInicial.getFullYear() == fechaBuscada.getFullYear()
        //     && fechaInicial.getMonth() == fechaBuscada.getMonth()
        //     && fechaInicial.getDate() == fechaBuscada.getDate())

        // console.log('***************************************************************************');

        return fechaInicial.getFullYear() == fechaFin.getFullYear()
            && fechaInicial.getMonth() == fechaFin.getMonth()
            && fechaInicial.getDate() == fechaFin.getDate();

    }



}
