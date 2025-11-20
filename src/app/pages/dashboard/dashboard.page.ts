import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/aapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {

  productos: any[] = [];
  ventas: any[] = [];
  totalVentas: number = 0;
  bajoStock: any[] = [];

  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    try {
      // Productos
      this.productos = await this.api.getProductos();
      console.log("Productos:", this.productos);

      // Stock bajo (<=5)
      this.bajoStock = this.productos.filter(p => p.stock <= 5);

      // Ventas
      this.ventas = await this.api.getVentas();
      console.log("Ventas:", this.ventas);

      // Total de ventas (ya no usamos attributes)
      this.totalVentas = this.ventas.reduce((acc, v) => {
        const precio = v.precio ?? 0;
        const cantidad = v.cantidad ?? 1;
        return acc + precio * cantidad;
      }, 0);

    } catch (err) {
      console.error('Error al cargar dashboard:', err);
    }
  }

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}
