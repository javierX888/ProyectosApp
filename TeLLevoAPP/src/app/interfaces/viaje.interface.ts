export interface Filtros {
  sede: string;
  fecha: string;
  rangoHora: string;
  origen?: string;
  destino?: string;
}

export interface Sede {
  sede: string;
  comuna: string;
}

export type EstadoViaje = 'disponible' | 'reservado' | 'aceptado' | 'cancelado' | 'completado' | 'activo';

export interface Viaje {
  id: number;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  asientosDisponibles: number;
  precio: number;
  conductorNombre: string;
  estado: EstadoViaje;
  vehiculo: {
    modeloVehiculo: string;
    patente: string;
  };
  pasajeros: string[];
}