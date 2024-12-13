export interface Region {
    id: number;
    nombre: string;
    comunas: Comuna[];
  }
  
  export interface Comuna {
    nombre: string;
    sedes: string[];
  }
  
  export interface Sede {
    id?: number;
    nombre: string; 
    comuna: string;
    region: string;
  }