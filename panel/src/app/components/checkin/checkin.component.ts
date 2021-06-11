import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { Reserva } from '../../models/reserva';
import { ReservaFiltros } from '../../models/filter/reserva.filtros';
import { Sector } from '../../models/sector';
import { AuthService } from '../../services/auth.service';
import { ReservaService } from '../../services/reserva.service';
import { SectorService } from '../../services/sector.service';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000
});

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class ChackInComponent implements AfterViewInit {

  panelOpenState = false;
  filtro: ReservaFiltros;
  sectores: Sector[];
  displayedColumns: string[] = ['select', 'Codigo Reserva', 'DNI', 'Fecha Reserva', 'Espacio', 'Sector'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  mouseOverIndex = -1;
  selection = new SelectionModel<Reserva>(true, []);

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private sectorService: SectorService,
    private reservaService: ReservaService
  ) {
    this.filtro = new ReservaFiltros();
    this.filtro.fecha = new Date();
    this.obtenerSectores();
  }

  ngAfterViewInit() {
  }

  confirmarIngreso() {
    this.reservaService.checkIn(this.selection.selected)
      .subscribe(
        response => {
          Toast.fire({
            type: 'success',
            title: 'Check-in exitoso'
          });
          this.limpiar();
        }
      );
  }


  limpiar() {
    this.filtro = new ReservaFiltros();
    this.dataSource = new MatTableDataSource();
  }

  buscarRerseva() {
    this.dataSource = new MatTableDataSource<Reserva>(null);
    this.reservaService.findByFiltro(this.filtro).subscribe((response: any) => {
      console.log(response);
      if (response && response.length > 0) {
        this.dataSource = new MatTableDataSource<Reserva>(response as Reserva[]);
      } else {
        Toast.fire({
          type: 'error',
          title: 'No se encontraron datos para este DNI'
        });
      }

    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row =>
        this.selection.select(row as Reserva)
      );
  }

  obtenerSectores() {
    this.sectorService.findAll().subscribe((response: any) => {
      console.log();
      this.sectores = response as Sector[];
    });
  }

}
