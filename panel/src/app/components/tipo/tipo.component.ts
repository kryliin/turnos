import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { Tipo } from '../../models/tipo';
import { AuthService } from '../../services/auth.service';
import { TipoService } from '../../services/tipo.service';
import Swal from 'sweetalert2';
import { DialogoTipo } from './dialogoEntidad/tipo.dialogo';

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000
});

@Component({
  selector: 'app-tipo',
  templateUrl: './tipo.component.html',
  styleUrls: ['./tipo.component.css']
})
export class TipoComponent implements AfterViewInit {

  tipo: Tipo;
  displayedColumns: string[] = ['ID', 'Nombre', 'Acciones'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  mouseOverIndex = -1;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;


  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private tipoService: TipoService
  ) { }


  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.tipoService.findAll();
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = (data as Tipo[]).length;
          this.dataSource = new MatTableDataSource<Tipo>(data as Tipo[]);
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        return this.dataSource = new MatTableDataSource<Tipo>(data as Tipo[]);
      });
  }

  public onMouseOver(index) {
    this.mouseOverIndex = index;
  }

  dialgoEditar(data: any): void {
    this.tipo = data as Tipo;
    const dialogRef = this.dialog.open(DialogoTipo, {
      disableClose: true,
      width: '60%',
      data: data
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!(result == null)) {
        this.update(result as Tipo);
      }
    });
  }

  dialogoEliminar(tipo: Tipo): void {
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
        this.tipoService.deleteById(tipo.id)
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
    this.tipoService.update(entity)
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

  dialogoAgregar(): void {
    this.tipo = new Tipo();
    const dialogRef = this.dialog.open(DialogoTipo, {
      disableClose: true,
      width: '85%',
      data: this.tipo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!(result == null)) {
        this.ngAfterViewInit();
      }
    });
  }





}
