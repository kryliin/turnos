import { Role } from "./role";

export class Usuario {

  user: string;
  pass: string;

  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles: Role[];

  version: number;

  isEdit: Boolean;

}
