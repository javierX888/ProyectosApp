export interface User {
    id: string;
    email: string;
    tipo: 'conductor' | 'pasajero';
    nombre: string;
  }