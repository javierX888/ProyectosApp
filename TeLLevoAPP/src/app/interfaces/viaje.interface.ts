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

export interface Viaje {
  id: number;
  origen: string;
  destino: string;
  fecha: string;
  hora: string;
  patente?: string;
  asientosDisponibles: number;
  precio: number;
  conductorNombre: string;
  estado: 'disponible' | 'reservado' | 'aceptado' | 'cancelado' | 'completado';
  vehiculo?: {
    modeloVehiculo: string;
    patente: string;
  };
  pasajeros: string[];
  pasajeroNombre?: string;
}