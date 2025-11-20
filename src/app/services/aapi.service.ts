import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../environments/environment';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private toastCtrl: ToastController) {}

  // ======================================
  // 🔐 AUTHENTICACIÓN
  // ======================================

  private getAuthHeaders() {
    // ⚠️ Nota: Esta implementación asume que el token se guarda y recupera de localStorage SÍNCRONAMENTE.
    const token = localStorage.getItem('token');
    return token ? { Authorization: 'Bearer ' + token } : {};
  }

    async login(identifier: string, password: string) {
        try {
            const res = await axios.post(`${this.apiUrl}/auth/local`, { identifier, password });
            // Guarda el token para usarlo en peticiones futuras
            localStorage.setItem('token', res.data.jwt); 
            localStorage.setItem('user', JSON.stringify(res.data.user));
            return res.data;
        } catch (err) {
            this.showToast('Error al iniciar sesión');
            throw err;
        }
    }

    // Nota: La función logout generalmente se implementa en un AuthService separado.
    // Aquí solo borramos el token de localStorage.
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

  // ======================================
  // 📦 PRODUCTOS
  // ======================================

  async getProductos() {
    try {
      // Función usada por el Dashboard para obtener el stock
      const res = await axios.get(`${this.apiUrl}/productos?populate=*`, {
        headers: this.getAuthHeaders()
      });
      return res.data.data;
    } catch (err) {
      this.showToast('Error al obtener productos');
      throw err;
    }
  }

  async addProducto(data: any) {
    try {
      const res = await axios.post(`${this.apiUrl}/productos`, { data }, {
        headers: this.getAuthHeaders()
      });
      return res.data;
    } catch (err) {
      this.showToast('Error al agregar producto');
      throw err;
    }
  }

  async updateProducto(documentId: string, data: any) {
    try {
      const res = await axios.put(`${this.apiUrl}/productos/${documentId}`, { data }, {
        headers: this.getAuthHeaders()
      });
      return res.data;
    } catch (err) {
      this.showToast('Error al actualizar producto');
      throw err;
    }
  }

  async deleteProducto(documentId: string) {
    try {
      const res = await axios.delete(`${this.apiUrl}/productos/${documentId}`, {
        headers: this.getAuthHeaders()
      });
      return res.data;
    } catch (err) {
      this.showToast('Error al eliminar producto');
      throw err;
    }
  }

  // ======================================
  // 💲 VENTAS
  // ======================================

 async registrarVenta(data: any) {
  try {
    const res = await axios.post(`${this.apiUrl}/ventas`, { data }, {
      headers: this.getAuthHeaders()
    });
    return res.data;
  } catch (err) {
    this.showToast('Error al registrar venta');
    throw err;
  }
}

async getVentas() {
  try {
    const res = await axios.get(`${this.apiUrl}/ventas?populate=*`, {
      headers: this.getAuthHeaders()
    });

    return res.data.data.map((v: any) => {
      
      // Caso 1: Estructura con attributes
      if (v.attributes) {
        return {
          id: v.id,
          ...v.attributes,
          producto: v.attributes.producto?.data?.attributes || null
        };
      }

      // Caso 2: Estructura PLANA sin attributes (como tu API)
      return {
        id: v.id,
        ...v,
        producto: v.producto || null
      };
    });

  } catch (err) {
    this.showToast('Error al obtener ventas');
    throw err;
  }
}





  // ======================================
  // 📦 INVENTARIO
  // ======================================

  async getInventario() {
    try {
      // Función usada por el Dashboard (si fuera necesario, aunque ya se obtiene por getProductos)
      const res = await axios.get(`${this.apiUrl}/inventarios?populate=*`, {
        headers: this.getAuthHeaders()
      });
      return res.data.data;
    } catch (err) {
      this.showToast('Error al obtener inventario');
      throw err;
    }
  }

  // ======================================
  // 📊 REPORTES
  // ======================================

  async getReporte(fechaInicio: string, fechaFin: string) {
    try {
      const res = await axios.get(
        `${this.apiUrl}/ventas?filters[fecha][$between]=${fechaInicio},${fechaFin}`,
        { headers: this.getAuthHeaders() }
      );
      return res.data.data;
    } catch (err) {
      this.showToast('Error al generar reporte');
      throw err;
    }
  }

  // ======================================
  // 👤 USUARIOS
  // ======================================

  async getUsuarios() {
    try {
      const res = await axios.get(`${this.apiUrl}/users`, {
        headers: this.getAuthHeaders()
      });
      return res.data;
    } catch (err) {
      this.showToast('Error al obtener usuarios');
      throw err;
    }
  }

  // ======================================
  // 🔔 TOAST
  // ======================================

  private async showToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
}