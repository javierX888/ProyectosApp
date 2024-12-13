import { Injectable } from '@angular/core';
import { Region, Comuna, Sede } from '../interfaces/sede.interface';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private regiones: Region[] = [
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
    // Agrega otras regiones aquí...
  ];

  constructor() { }

  getRegiones(): Region[] {
    return this.regiones;
  }

  getSedes(): Sede[] {
    return this.regiones.flatMap((region: Region) => 
      region.comunas.flatMap((comuna: Comuna) => 
        comuna.sedes.map((sede: string) => ({
          nombre: sede,
          comuna: comuna.nombre,
          region: region.nombre
        }))
      )
    );
  }

  getComunas(region: string): string[] {
    return this.getComunasByRegion(region);
  }

  getRegionBySede(sede: string): string | null {
    for (const region of this.regiones) {
      for (const comuna of region.comunas) {
        if (comuna.sedes.includes(sede)) {
          return region.nombre;
        }
      }
    }
    return null;
  }
  
  getComunasByRegion(regionNombre: string): string[] {
    const region = this.regiones.find(r => r.nombre === regionNombre);
    return region ? region.comunas.map(c => c.nombre) : [];
  }
}