// import axios from "axios";
// import config from "./config";
import {client} from './config'

const validarPersona = (person) => {
    return client.post('reserva/playa/validar',person)
}

export { validarPersona }
