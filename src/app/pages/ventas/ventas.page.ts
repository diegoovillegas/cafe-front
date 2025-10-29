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
    if (!this.ventaSeleccionada.productoId || this.ventaSeleccionada.cantidad <= 0) {
      alert('Seleccione un producto y cantidad válida');
      return;
    }

    const producto = this.productos.find(p => p.id === this.ventaSeleccionada.productoId);
    if (producto.attributes.stock < this.ventaSeleccionada.cantidad) {
      alert('Stock insuficiente');
      return;
    }

    const data = {
      producto: this.ventaSeleccionada.productoId,
      cantidad: this.ventaSeleccionada.cantidad,
      precio: producto.attributes.precio,
      fecha: new Date()
    };

    try {
      await this.api.registrarVenta(data);

      // Actualizar inventario localmente para refrescar la lista de productos
      producto.attributes.stock -= this.ventaSeleccionada.cantidad;

      // Reset del formulario
      this.ventaSeleccionada = { productoId: null, cantidad: 1 };

      // Recargar ventas
      await this.cargarVentas();
    } catch (err) {
      console.error('Error al registrar venta:', err);
    }
  }

    async logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login')
  }
}
