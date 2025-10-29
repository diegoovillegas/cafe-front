import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/aapi.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
  standalone: false
})
export class InventarioPage implements OnInit {
  inventario: any[] = [];
  alertaStock: number = 5; // Stock mínimo para alerta

  constructor(private api: ApiService, private router:Router) {}

  async ngOnInit() {
    await this.cargarInventario();
  }

  async cargarInventario() {
    try {
      this.inventario = await this.api.getInventario();
    } catch (err) {
      console.error('Error al cargar inventario:', err);
    }
  }

    async logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login')
  }
}
