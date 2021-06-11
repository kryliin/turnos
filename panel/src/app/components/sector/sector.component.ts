import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { Sector } from '../../models/sector';
import { AuthService } from '../../services/auth.service';
import { SectorService } from '../../services/sector.service';
import Swal from 'sweetalert2';
import { DialogoSector } from './dialogoEntidad/sector.dialogo';

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000
});

@Component({
  selector: 'app-sector',
  templateUrl: './sector.component.html',
  styleUrls: ['./sector.component.css']
})
export class SectorComponent implements AfterViewInit {

  sector: Sector;
  displayedColumns: string[] = ['ID', 'Espacio', 'Nombre', 'Cupo Maximo', 'Turno', 'Fecha Inicio', 'Fecha Fin', 'Acciones'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  mouseOverIndex = -1;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;


  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private sectorService: SectorService
  ) { }


  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.sectorService.findAll();
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = (data as Sector[]).length;
          this.dataSource = new MatTableDataSource<Sector>(data as Sector[]);
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        return this.dataSource = new MatTableDataSource<Sector>(data as Sector[]);
      });
  }

  public onMouseOver(index) {
    this.mouseOverIndex = index;
  }

  dialogoAgregar(): void {
    this.sector = new Sector();
    const dialogRef = this.dialog.open(DialogoSector, {
      disableClose: true,
      width: '85%',
      data: this.sector
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngAfterViewInit();
    });
  }

  dialgoEditar(data: any): void {
    this.sector = data as Sector;
    const dialogRef = this.dialog.open(DialogoSector, {
      disableClose: true,
      width: '60%',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result == null)) {
        this.update(result as Sector);
      }
    });
  }

  dialogoEliminar(sector: Sector): void {
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
        this.sectorService.deleteById(sector.id)
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

  update(sector: Sector): void {
    this.sectorService.update(sector)
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
    applyFilter(tipoPrestacion) {
      if (tipoPrestacion === '') {
        this.sectorService.findEspecialidadAll()
          .subscribe((response: any) => {
            this.dataSource.data = response as Sector[];
          });
      } else {
        this.sectorService.findEspecialidadByNameAll(tipoPrestacion)
          .subscribe((response: any) => {
            this.dataSource.data = response as Sector[];
          });
      }
    }*/
  /*
    openDialog(): void {
      this.espacio = new Sector();
      const dialogRef = this.dialog.open(DialogEspecialidadComponent, {
        disableClose: true,
        width: '85%',
        data: this.especialidad
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (!(result == null)) {
          this.saveEspecialidad(result as Sector);
        }
      });
    }*/
  /*
    
  */
  /*
    saveEspecialidad(especialidad: Sector): void {
      this.sectorService.saveEspecialidad(especialidad)
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
    updateEspecialidad(especialidad: Sector): void {
      this.sectorService.updateEspecialidad(especialidad)
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
