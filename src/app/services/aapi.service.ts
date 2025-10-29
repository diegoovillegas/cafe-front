import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '../../environments/environment';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api: AxiosInstance;
  private storage: Storage;

  constructor(private toastCtrl: ToastController) {
    // Configuración de Axios
    this.api = axios.create({
      baseURL: environment.apiUrl,
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' }
    });

    // Crear instancia local de Storage
    this.storage = new Storage({ name: '__mydb' });
    this.storage.create();
  }

  // --- Autenticación ---
  async login(identifier: string, password: string) {
    try {
      const res = await this.api.post('/auth/local', { identifier, password });
      await this.storage.set('token', res.data.jwt);
      await this.storage.set('user', res.data.user);
      return res.data;
    } catch (err) {
      this.showToast('Error al iniciar sesión');
      throw err;
    }
  }

  async getToken() {
    return await this.storage.get('token');
  }

  private async authHeader() {
    const token = await this.getToken();
    return { Authorization: `Bearer ${token}` };
  }

  // --- Productos ---
  async getProductos() {
    const res = await this.api.get('/productos?populate=*', {
      headers: await this.authHeader()
    });
    return res.data.data;
  }

  async addProducto(data: any) {
    const res = await this.api.post('/productos', { data }, {
      headers: await this.authHeader()
    });
    return res.data;
  }

  async updateProducto(id: number, data: any) {
    const res = await this.api.put(`/productos/${id}`, { data }, {
      headers: await this.authHeader()
    });
    return res.data;
  }

  async deleteProducto(id: number) {
    const res = await this.api.delete(`/productos/${id}`, {
      headers: await this.authHeader()
    });
    return res.data;
  }

  // --- Ventas ---
  async registrarVenta(data: any) {
    const res = await this.api.post('/ventas', { data }, {
      headers: await this.authHeader()
    });
    return res.data;
  }

  async getVentas() {
    const res = await this.api.get('/ventas?populate=*', {
      headers: await this.authHeader()
    });
    return res.data.data;
  }

  // --- Inventario ---
  async getInventario() {
    const res = await this.api.get('/inventarios?populate=*', {
      headers: await this.authHeader()
    });
    return res.data.data;
  }

  // --- Reportes ---
  async getReporte(fechaInicio: string, fechaFin: string) {
    const res = await this.api.get(`/ventas?filters[fecha][$between]=${fechaInicio},${fechaFin}`, {
      headers: await this.authHeader()
    });
    return res.data.data;
  }

  // --- Usuarios ---
  async getUsuarios() {
    const res = await this.api.get('/users', {
      headers: await this.authHeader()
    });
    return res.data;
  }

  // --- Utilidades ---
  private async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
}
