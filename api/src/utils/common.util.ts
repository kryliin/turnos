export class CommonUtil {

    static dniER = /^\d{8}(?:[-\s]\d{4})?$/;
    static LETRAS_ARRAY = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    static LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    static SEPADADOR = '-';

    static validaCodigoReserva(codigoReserva: string) {
        const string = "foo";
        const substring = "oo";
        return this.LETRAS.includes(codigoReserva[0]) && this.LETRAS.includes(codigoReserva[1]) && this.SEPADADOR.includes(codigoReserva[2]);
    }

    public static validaSexo(sexo: string) {
        return sexo === 'F' || sexo === 'f' || sexo === 'M' || sexo === 'm';
    }

    public static validaDNI(dni: string): boolean {
        if (this.dniER.test(dni) == true) {
            return true;
        } else {
            return false;
        }
    }

    public static obtenerLetraRandom(): string {
        const min = 0;
        const max = this.LETRAS_ARRAY.length - 1;
        return this.LETRAS_ARRAY[Math.round(Math.random() * (max - min) + min)];
    }

}
