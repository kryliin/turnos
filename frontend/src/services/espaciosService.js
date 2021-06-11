/*import axios from "axios";
import config from "./config";*/
import {client} from './config'

const getEspacios = (id) => {
    return client.get('espacio'+(id ? id : ''))
}

export { getEspacios }
