import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { Turno } from '../../models/turno';
import { AuthService } from '../../services/auth.service';
import { TurnoService } from '../../services/turno.service';
import Swal from 'sweetalert2';
import { DialogoTurno } from './dialogoEntidad/turno.dialogo';

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000
});

@Component({
  selector: 'app-turno',
  templateUrl: './turno.component.html',
  styleUrls: ['./turno.component.css']
})
export class TurnoComponent implements AfterViewInit {

  turno: Turno;
  displayedColumns: string[] = ['ID', 'Espacio', 'Nombre', 'Fecha Inicio', 'Fecha Fin', 'Acciones'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  mouseOverIndex = -1;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;


  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private turnoService: TurnoService
  ) { }


  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.turnoService.findAll();
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = (data as Turno[]).length;
          this.dataSource = new MatTableDataSource<Turno>(data as Turno[]);
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        return this.dataSource = new MatTableDataSource<Turno>(data as Turno[]);
      });
  }

  public onMouseOver(index) {
    this.mouseOverIndex = index;
  }

  dialogoAgregar(): void {
    this.turno = new Turno();
    const dialogRef = this.dialog.open(DialogoTurno, {
      disableClose: true,
      width: '85%',
      data: this.turno
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngAfterViewInit();
    });
  }

  dialgoEditar(data: any): void {
    this.turno = data as Turno;
    const dialogRef = this.dialog.open(DialogoTurno, {
      disableClose: true,
      width: '60%',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!(result == null)) {
        this.update(result as Turno);
      }
    });
  }

  dialogoEliminar(turno: Turno): void {
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
        this.turnoService.deleteById(turno.id)
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

  update(entity: any): void {
    this.turnoService.update(entity)
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







  /*
    applyFilter(turnoPrestacion) {
      if (turnoPrestacion === '') {
        this.turnoService.findEspecialidadAll()
          .subscribe((response: any) => {
            this.dataSource.data = response as Turno[];
          });
      } else {
        this.turnoService.findEspecialidadByNameAll(turnoPrestacion)
          .subscribe((response: any) => {
            this.dataSource.data = response as Turno[];
          });
      }
    }*/
  /*
    openDialog(): void {
      this.espacio = new Turno();
      const dialogRef = this.dialog.open(DialogEspecialidadComponent, {
        disableClose: true,
        width: '85%',
        data: this.especialidad
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (!(result == null)) {
          this.saveEspecialidad(result as Turno);
        }
      });
    }*/

  /*
    saveEspecialidad(especialidad: Turno): void {
      this.turnoService.saveEspecialidad(especialidad)
        .subscribe(
          response => {
            this.ngAfterViewInit();
            Toast.fire({
              type: 'success',
              title: 'Prestación Agregada exitosamente'
            });
          }
        );
    }*/
  /*
    updateEspecialidad(especialidad: Turno): void {
      this.turnoService.updateEspecialidad(especialidad)
        .subscribe(
          response => {
            this.ngAfterViewInit();
            Toast.fire({
              type: 'success',
              title: 'Prestación Actualizada exitosamente'
            });
          },
          err => {
            Toast.fire({
              type: 'error',
              title: err.error.errors
            });
          }
        );
    }
  
    canAdd(): Boolean {
      return this.authService.isRoleSuper() || this.authService.isRoleAdmin() || this.authService.isRoleUser();
    }
  
    canEdit(): Boolean {
      return this.authService.isRoleSuper() || this.authService.isRoleAdmin() || this.authService.isRoleUser();
    }
  
    canDelete(): Boolean {
      return this.authService.isRoleSuper() || this.authService.isRoleAdmin();
    }
  */
}
