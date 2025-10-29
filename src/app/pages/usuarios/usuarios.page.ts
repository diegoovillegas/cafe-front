import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/aapi.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: false
})
export class UsuariosPage implements OnInit {
  usuarios: any[] = [];

  constructor(private api: ApiService, private router:Router) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    try {
      const data = await this.api.getUsuarios();
      this.usuarios = data.users || data; // dependiendo de cómo Strapi devuelva los datos
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  }

    async logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/login')
  }
}
