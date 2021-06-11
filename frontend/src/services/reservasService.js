// import axios from "axios";
// import config from "./config";
import {client} from './config';

const getEstadoReservas = (days) => {
    return client.get('reserva/playa/'+ days)
}

const postReserva =  (data,token) => {
    return client.post('reserva/playa/reservar',data,{
        headers:{
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
        }
    })
}

const deleteReserva = ({dni,codigoReserva}) => {
    return client.post('reserva/playa/cancelar',{
        dni: dni,
        codigoReserva: codigoReserva
    })
}

export { getEstadoReservas, postReserva, deleteReserva }
