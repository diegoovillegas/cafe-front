import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/aapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.page.html',
  styleUrls: ['./reporte.page.scss'],
  standalone: false
})
export class ReportePage implements OnInit {
  fechaInicio: string = new Date().toISOString();
  fechaFin: string = new Date().toISOString();
  ventas: any[] = [];
  totalVentas: number = 0;

  constructor(private api: ApiService, private router:Router) {}

  ngOnInit() {
    this.filtrarVentas(); // carga inicial
  }

  async filtrarVentas() {
    try {
      this.ventas = await this.api.getReporte(this.fechaInicio, this.fechaFin);
      this.calcularTotal();
    } catch (err) {
      console.error('Error al obtener reportes:', err);
    }
  }

  calcularTotal() {
    this.totalVentas = this.ventas.reduce((acc, venta) => {
      return acc + venta.attributes.precio * venta.attributes.cantidad;
    }, 0);
  }

    async logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login')
  }
}
