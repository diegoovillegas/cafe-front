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

  constructor(private api: ApiService, private router:Router) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    try {
      // Cargar productos
      this.productos = await this.api.getProductos();

      // Identificar productos con stock bajo
      this.bajoStock = this.productos.filter(p => p.stock <= 5);

      // Cargar ventas
      this.ventas = await this.api.getVentas();

      // Calcular total de ventas
      this.totalVentas = this.ventas.reduce((acc, v) => acc + v.attributes.precio * v.attributes.cantidad, 0);
    } catch (err) {
      console.error('Error al cargar dashboard:', err);
    }
  }

    async logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login')
  }
}
