import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { Parametro } from '../../models/parametro';
import { ParametroService } from '../../services/parametro.service';
import { DialogParametroComponent } from './dialogUpdate/parametro.dialog';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});

@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['parametros.component.css']
})
export class ParametrosComponent {

  parametrosSource: Parametro[];
  parametro: Parametro;
  displayedColumns: string[] = ['Observacion', 'Valor', 'Acciones'];

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private parametroService: ParametroService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getListParametros();
  }

  editDialog(data: any): void {
    this.parametro = data as Parametro;
    const dialogRef = this.dialog.open(DialogParametroComponent, {
      disableClose: true,
      width: '60%',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!(result == null)) {
        if (!result.valor) {
          result.valor = 0;
        }
        this.updateParametro(result as Parametro);
      }
    });
  }

  updateParametro(parametro: Parametro): void {
    this.parametroService.update(parametro)
      .subscribe(
        response => {
          Toast.fire({
            type: 'success',
            title: 'Parámetro Actualizado'
          })
        }
      )
  }

  getListParametros(): void {
    this.parametrosSource = null;
    this.activatedRoute.paramMap.subscribe(params => {
      this.parametroService.findAll()
        .subscribe((response: any) => {
          this.parametrosSource = response as Parametro[];
        });
    });
  }

  canEdit(): Boolean {
    return this.authService.isRoleAdmin();
  }

}
