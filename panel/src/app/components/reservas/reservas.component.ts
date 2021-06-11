import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { merge, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Reserva } from '../../models/reserva';
import { AuthService } from '../../services/auth.service';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements AfterViewInit {

  reserva: Reserva;
  displayedColumns: string[] = ['ID', 'Codigo Reserva', 'Fecha Reserva', 'Fecha Ingreso', 'Fecha Baja', 'DNI', 'Espacio', 'Sector'];
  dataSource = new MatTableDataSource();
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  mouseOverIndex = -1;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    private reservaService: ReservaService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    merge(this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.reservaService.findAll();
        }),
        map(data => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = (data as Reserva[]).length;
          this.dataSource = new MatTableDataSource<Reserva>(data as Reserva[]);
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe(data => {
        return this.dataSource = new MatTableDataSource<Reserva>(data as Reserva[]);
      });
  }

}
