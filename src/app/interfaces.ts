// item.interface.ts
export interface IItem {
    codigo: string;
    nombre: string;
    precio: number;
    marca: string;
  }
  
  // venta-detalles.interface.ts
  export interface IVentaDetalles {
    codigo: string;
    nombre: string;
    marca: string;
    cantidad: number;
    precio: number;
    precioTotal: number;
  }