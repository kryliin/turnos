import axios from 'axios'
// baseUrl: 'http://turnos.cdeluruguay.gob.ar:3000/SRT/api/',
// baseUrl: 'http://192.168.2.111:3000/SRT/api/',
// const baseUrl= 'http://192.168.2.111:3000/SRT/api/'
// const baseUrl = 'http://localhost:3000/SRT/api/'
const baseUrl = 'http://167.172.230.42:3000/SRT/api/'

export const client = axios.create({
    baseURL: baseUrl,
    timeout: 10000
});
