import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/aapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: false
})
export class ProductosPage implements OnInit {
  productos: any[] = [];
  nuevoProducto = { nombre: '', precio: 0, categoria: '', stock: 0 };
  
  productoAEditar: any = null;
  isEditing: boolean = false;

  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    await this.cargarProductos();
  }

  async cargarProductos() {
    try {
      this.productos = await this.api.getProductos();
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  async agregarProducto() {
    await this.api.addProducto(this.nuevoProducto);
    this.nuevoProducto = { nombre: '', precio: 0, categoria: '', stock: 0 };
    await this.cargarProductos();
  }

  async eliminarProducto(documentId: string) {
    await this.api.deleteProducto(documentId);
    await this.cargarProductos();
  }

  iniciarEdicion(producto: any) {
    this.productoAEditar = { ...producto }; 
    this.isEditing = true;
  }

  async guardarEdicion() {
    if (!this.productoAEditar || !this.productoAEditar.documentId) {
      console.error('No se pudo encontrar el ID del producto para actualizar.');
      return;
    }

    try {
      const documentId = this.productoAEditar.documentId;
      const datosAEnviar = { 
        nombre: this.productoAEditar.nombre,
        precio: this.productoAEditar.precio,
        categoria: this.productoAEditar.categoria,
        stock: this.productoAEditar.stock
      };

      await this.api.updateProducto(documentId, datosAEnviar);
      
      this.isEditing = false;
      this.productoAEditar = null;
      await this.cargarProductos();

    } catch (error) {
      console.error('Fallo en la actualización del producto:', error);
    }
  }

  cancelarEdicion() {
    this.isEditing = false;
    this.productoAEditar = null;
  }

  async logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login');
  }
}