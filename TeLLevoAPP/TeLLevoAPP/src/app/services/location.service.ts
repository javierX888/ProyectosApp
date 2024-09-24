import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private regiones = [
    {
      id: 13,
      nombre: 'Metropolitana',
      comunas: [
        { nombre: 'Santiago', sedes: ['Alameda', 'Padre Alonso de Ovalle', 'Escuela de Salud'] },
        { nombre: 'Providencia', sedes: ['Antonio Varas'] },
        { nombre: 'Maipú', sedes: ['Maipú'] },
        { nombre: 'Cerrillos', sedes: ['Plaza Oeste'] },
        { nombre: 'San Bernardo', sedes: ['San Bernardo'] },
        { nombre: 'Puente Alto', sedes: ['Puente Alto'] },
        { nombre: 'Melipilla', sedes: ['Melipilla'] }
      ]
    },
    {
      id: 5,
      nombre: 'Valparaíso',
      comunas: [
        { nombre: 'Viña del Mar', sedes: ['Viña del Mar'] },
        { nombre: 'Valparaíso', sedes: ['Valparaíso'] }
      ]
    },
    {
      id: 8,
      nombre: 'Biobío',
      comunas: [
        { nombre: 'Concepción', sedes: ['Concepción', 'San Andrés de Concepción'] }
      ]
    },
    {
      id: 6,
      nombre: 'O\'Higgins',
      comunas: [
        { nombre: 'Rancagua', sedes: ['Rancagua'] }
      ]
    },
    {
      id: 7,
      nombre: 'Maule',
      comunas: [
        { nombre: 'Talca', sedes: ['Talca'] }
      ]
    },
    {
      id: 9,
      nombre: 'La Araucanía',
      comunas: [
        { nombre: 'Temuco', sedes: ['Temuco'] }
      ]
    }
  ];

  getRegiones() {
    return this.regiones;
  }

  getComunas(regionId: number) {
    const region = this.regiones.find(r => r.id === regionId);
    return region ? region.comunas : [];
  }

  getSedes(regionId: number, comunaNombre: string) {
    const region = this.regiones.find(r => r.id === regionId);
    if (region) {
      const comuna = region.comunas.find(c => c.nombre === comunaNombre);
      return comuna ? comuna.sedes : [];
    }
    return [];
  }
}