import axios from "axios";
import config from "./config";
import {client} from "./config";

const getTurnos = (id) => {
    return client.get('turno/'+(id ? id : ''))
}

export { getTurnos }
