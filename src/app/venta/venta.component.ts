// venta.component.ts
import { Component, OnInit, ElementRef, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IItem, IVentaDetalles, iClient } from '../interfaces';
import { MatStepper } from '@angular/material/stepper';
import { Restangular } from 'ngx-restangular';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss']
})
export class VentaComponent implements OnInit {
  // Declaración de formularios
  itemForm!: FormGroup;
  detallesForm!: FormGroup;
  clientForm!: FormGroup;
  item: any;

  selectedItem: IItem | null = null; // Item seleccionado
  selectedClient: iClient | null = null;
  ventaDetalles: IVentaDetalles[] = []; // Detalles de venta


  // Agregar ViewChild para obtener referencia al input
  @ViewChild('cantidadInput') cantidadInput!: ElementRef;
  @ViewChild('codigoInput') codigoInput!: ElementRef;
  @ViewChild(MatStepper) stepper!: MatStepper;

  constructor(private fb: FormBuilder, private zone: NgZone,
    public restangular: Restangular,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Inicialización de formularios
    this.itemForm = this.fb.group({
      codigo: ['', Validators.required],
      cantidad: [1, Validators.required],
    });

    this.detallesForm = this.fb.group({
      cantidad: ['', Validators.required],
    });

    this.clientForm = this.fb.group({
      nit: ['', Validators.required],
      nombre: [''],
      telefono: [''],
      direccion: [''],
    });

  }

  // Método para realizar la búsqueda de un solo item
  searchItem() {
    const codigo = this.itemForm.get('codigo')?.value;
    this.itemForm.get('codigo')?.setValue('');
    // Verificar si el campo "codigo" no está vacío
    if (codigo) {
      this.restangular.one('itemone').get({ codigo: codigo }).subscribe(
        (response: any) => {
          if (response && response.id !== undefined) {
            this.selectedItem = response;
            console.log(this.selectedItem);
            this.setFocusOnInput(this.cantidadInput, 1);
          } else {
            this.showNotification('Producto inexistente');
            this.codigoInput.nativeElement.select();
          }
        },
        (error: any) => {
          console.error("Error al obtener el producto", error);
          this.showNotification('Error al obtener el producto');
        }
      );
    }
  }

  searchClient() {
    const nit = this.clientForm.get('nit')?.value;

    if (nit) {
      this.restangular.one('clientone').get({ nit: nit }).subscribe(
        (response: any) => {
          if (response && response.id !== undefined) {
            this.selectedClient = response;
            this.clientForm.patchValue(response); // Llenar el formulario con los datos del cliente
          } else {
            this.showNotification('Cliente nuevo');
          }
        },
        (error: any) => {
          console.error("Error al consultar cliente", error);
          this.showNotification('Error al consultar cliente');
        }
      );
    }
  }

  updateClient() {
    // Puedes enviar la solicitud para actualizar el cliente aquí
    // this.selectedClient contiene los datos actuales del cliente
    // this.clientForm.value contiene los datos editados

    // Después de la actualización, puedes realizar acciones adicionales según sea necesario

    // Ejemplo: Mostrar notificación
    this.showNotification('Cliente actualizado exitosamente');
  }
  // Función para establecer el enfoque en el input especificado
  private setFocusOnInput(inputElement: ElementRef, defaultValue: number | string = '') {
    // Utilizamos el tiempo de espera para asegurarnos de que el DOM se haya actualizado
    setTimeout(() => {
      if (inputElement && inputElement.nativeElement) {
        inputElement.nativeElement.focus();
        inputElement.nativeElement.value = defaultValue.toString(); // Establecer el valor predeterminado
        inputElement.nativeElement.select(); // Seleccionar todo el texto
      }
    });
  }
  //Mostrar notificaciones en pantalla
  showNotification(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000, // Duración en milisegundos (3 segundos en este ejemplo)
      panelClass: 'custom-notification-class' // Puedes definir tu propia clase de estilo en CSS
    });
  }
  // Método para agregar un producto a los detalles de venta
  agregarItem() {
    const cantidad = this.itemForm.get('cantidad')?.value;

    // Verificar si tanto "codigo" como "cantidad" no están vacíos
    if (this.selectedItem && cantidad !== null && cantidad !== undefined && cantidad > 0) {
      // Verificar si hay suficiente stock
      if (this.selectedItem.stock >= cantidad) {
        // Verificar si el item_id ya está en la lista
        if (!this.ventaDetalles.some(detalle => detalle.item_id === this.selectedItem?.id)) {
          const detalle: IVentaDetalles = {
            item_id: this.selectedItem.id,
            codigo: this.selectedItem.codigo,
            nombre: this.selectedItem.nombre,
            marca: this.selectedItem.marca,
            cantidad: cantidad,
            precio: this.selectedItem.precio_venta,
            precioTotal: this.selectedItem.precio_venta * cantidad,
            stock_temporal: this.selectedItem.stock,
          };

          this.ventaDetalles.push(detalle);
          this.itemForm.reset();

          // Restablecer solo el campo de cantidad a su valor predeterminado
          this.itemForm.get('cantidad')?.setValue(1);

          // Establecer el enfoque en el campo "codigo" después de agregar el ítem
          this.setFocusOnInput(this.codigoInput);
        } else {
          // Mostrar notificación de "Item ya agregado"
          this.showNotification('El producto ya ha sido agregado a la lista');
          this.setFocusOnInput(this.codigoInput, '');
        }
      } else {
        // Mostrar notificación de "Stock no disponible"
        this.showNotification('Stock no disponible');
      }
    }
  }


  // Método para actualizar la cantidad en la lista de detalles de venta
  updateCantidad(detalle: IVentaDetalles, event: any) {
    // Comprobar si event.target es nulo antes de acceder a value
    if (event.target.value <= 0) {
      event.target.value = 1;
    }
    const nuevaCantidad = event?.target?.value;

    if (nuevaCantidad !== null && nuevaCantidad !== undefined) {
      // Verificar si la nueva cantidad no excede el stock temporal
      if (detalle.stock_temporal >= nuevaCantidad) {
        detalle.cantidad = nuevaCantidad;
        detalle.precioTotal = detalle.precio * nuevaCantidad;
      } else {
        // Mostrar notificación de "Stock no disponible"
        this.showNotification('Stock no disponible');
        // Restablecer la cantidad al valor anterior
        event.target.value = detalle.stock_temporal;
      }
    }
  }

  quitarProducto(index: number) {
    this.ventaDetalles.splice(index, 1);
  }

  getSumaTotal(): number {
    return this.ventaDetalles.reduce((total, detalle) => total + detalle.precioTotal, 0);
  }
}
