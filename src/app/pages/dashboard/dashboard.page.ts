import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/aapi.service';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {

  productos: any[] = [];
  ventas: any[] = [];
  bajoStock: any[] = [];
  totalVentas: number = 0;

  ventasChart: any;

  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    await this.cargarDatos();
    this.renderChart();
  }

  async cargarDatos() {
    try {
      this.productos = await this.api.getProductos();
      this.bajoStock = this.productos.filter(p => p.stock <= 5);

      this.ventas = await this.api.getVentas();

      this.totalVentas = this.ventas.reduce((acc, v) => {
        const precio = v.precio ?? 0;
        const cantidad = v.cantidad ?? 1;
        return acc + precio * cantidad;
      }, 0);

    } catch (err) {
      console.error("Error en dashboard:", err);
    }
  }

  renderChart() {
    const canvas: any = document.getElementById('ventasChart');

    if (this.ventasChart) this.ventasChart.destroy();

    this.ventasChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.ventas.map(v => v.fecha ?? 'Sin fecha'),
        datasets: [{
          label: 'Monto de Venta',
          data: this.ventas.map(v => v.precio * v.cantidad),
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}
