// item.interface.ts
export interface IItem {
  id:number;  
  codigo: string;
    nombre: string;
    precio: number;
    marca: string;
    precio_venta:number;
    stock:number;
  }
  // venta-detalles.interface.ts
  export interface IVentaDetalles {
    item_id:number;
    codigo: string;
    nombre: string;
    marca: string;
    cantidad: number;
    precio: number;
    precioTotal: number;
    stock_temporal:number;
  }
  export interface iClient {
    id:number;
    nit: string;
    nombre: string;
    telefono: string;
    direccion: string;
  }