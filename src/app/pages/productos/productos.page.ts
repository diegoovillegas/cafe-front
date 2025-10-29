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

  constructor(private api: ApiService, private router: Router) {}

  async ngOnInit() {
    await this.cargarProductos();
  }

  async cargarProductos() {
    this.productos = await this.api.getProductos();
  }

  async agregarProducto() {
    await this.api.addProducto(this.nuevoProducto);
    this.nuevoProducto = { nombre: '', precio: 0, categoria: '', stock: 0 };
    await this.cargarProductos();
  }

  async eliminarProducto(id: number) {
    await this.api.deleteProducto(id);
    await this.cargarProductos();
  }

    async logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login')
  }
}
