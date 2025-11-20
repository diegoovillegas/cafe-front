import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/aapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.page.html',
  styleUrls: ['./ventas.page.scss'],
  standalone: false
})
export class VentasPage implements OnInit {

  productos: any[] = [];
  ventas: any[] = [];

  ventaSeleccionada = {
    productoId: null,
    cantidad: 1
  };

  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    await this.cargarProductos();
    await this.cargarVentas();
  }

  async cargarProductos() {
    try {
      this.productos = await this.api.getProductos();
    } catch (err) {
      console.error('Error al cargar productos:', err);
    }
  }

  async cargarVentas() {
    try {
      this.ventas = await this.api.getVentas();
    } catch (err) {
      console.error('Error al cargar ventas:', err);
    }
  }

  async registrarVenta() {
    const { productoId, cantidad } = this.ventaSeleccionada;

    if (!productoId || cantidad <= 0) {
      alert('Seleccione un producto y una cantidad válida');
      return;
    }

    const producto = this.productos.find(p => p.documentId === productoId);

    if (!producto) {
      alert('Producto no encontrado');
      return;
    }

    // Validar stock
    if (producto.stock < cantidad) {
      alert('Stock insuficiente');
      return;
    }

    const data = {
      producto: productoId,
      cantidad,
      precio: producto.precio,
      fecha: new Date().toISOString()
    };

    try {
      await this.api.registrarVenta(data);

      // Actualizar stock localmente
      producto.stock -= cantidad;

      // Reset del formulario
      this.ventaSeleccionada = { productoId: null, cantidad: 1 };

      // Recargar ventas
      await this.cargarVentas();

    } catch (err) {
      console.error('Error al registrar venta:', err);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}
