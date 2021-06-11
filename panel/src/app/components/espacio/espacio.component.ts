import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { Espacio } from '../../models/espacio';
import { AuthService } from '../../services/auth.service';
import { EspacioService } from '../../services/espacio.service';
import { DialogoEspacio } from './dialogoEntidad/espacio.dialogo';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000
});

@Component({
  selector: 'app-espacio',
  templateUrl: './espacio.component.html',
  styleUrls: ['espacio.component.css']
})
export class EspacioComponent implements AfterViewInit {

  espacio: Espacio;
  displayedColumns: string[] = ['ID', 'Tipo', 'Nombre', 'Fecha Inicio', 'Fecha Fin', 'Acciones'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  mouseOverIndex = -1;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;


  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private espacioService: EspacioService
  ) { }


  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.espacioService.findAll();
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = (data as Espacio[]).length;
          this.dataSource = new MatTableDataSource<Espacio>(data as Espacio[]);
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        return this.dataSource = new MatTableDataSource<Espacio>(data as Espacio[]);
      });
  }

  public onMouseOver(index) {
    this.mouseOverIndex = index;
  }

  dialogoAgregar(): void {
    this.espacio = new Espacio();
    const dialogRef = this.dialog.open(DialogoEspacio, {
      disableClose: true,
      width: '65%',
      height: '90%',
      data: this.espacio
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ngAfterViewInit();
    });
  }

  dialgoEditar(data: any): void {
    this.espacio = data as Espacio;
    const dialogRef = this.dialog.open(DialogoEspacio, {
      disableClose: true,
      width: '60%',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result == null)) {
        this.update(result as Espacio);
      }
    });
  }

  dialogoEliminar(espacio: Espacio): void {
    Swal.fire({
      title: 'Notificación del sistema',
      text: 'Desea eliminar este registro de la base de datos?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.espacioService.deleteById(espacio.id)
          .subscribe(
            response => {
              Toast.fire({
                type: 'success',
                title: 'Entidad eliminada exitosamente'
              })
              this.ngAfterViewInit();
            }
          );
      }
    });
  }

  update(espacio: Espacio): void {
    this.espacioService.update(espacio)
      .subscribe(
        response => {
          this.ngAfterViewInit();
          Toast.fire({
            type: 'success',
            title: 'Entidad actualizada exitosamente'
          });
        },
        err => {
          Toast.fire({
            type: 'error',
            title: 'Error al actualizar la entidad'
          });
        }
      );
  }

}
