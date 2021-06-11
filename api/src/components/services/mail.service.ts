import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    public sendConfirmationMail(mail,params): void {
        this.mailerService
            .sendMail({
                to: mail, // list of receivers
                from: '"Turismo CDU" <reservas@cdeluruguay.gob.ar>', // sender address
                subject: 'Turno para playa reservado '+params.codigo+' - Tus datos', // Subject line
                template: 'turnoConfirmado',
                context: params
                // plaintext body
            })
            .then(res => console.log('res', res))
            .catch(err => console.log('err', err));
    }


    public sendCancellationMail(mail,params): void {
        this.mailerService
            .sendMail({
                to: mail, // list of receivers
                from: '"Turismo CDU" <reservas@cdeluruguay.gob.ar>', // sender address
                subject: 'Cancelación de turno '+params.codigo, // Subject line
                template: 'turnoCancelado',
                context:params

            })
    }

}
