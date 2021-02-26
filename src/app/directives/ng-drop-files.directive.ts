import { FileItem } from '../models/file-item';
import {
  Directive,
  EventEmitter,
  ElementRef,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appNgDropFiles]',
})
export class NgDropFilesDirective {
  // recivimos los archivos
  @Input() archivos: FileItem[] = [];

  // mandamos el evento cuando el mouse este sobre la caja de carga
  @Output() mouseSobre: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  // cuando el mosuse esta en el cuadro para cargar imagenes
  @HostListener('dragover', ['$event'])
  public onDragEnter(event: any): void {
    this.mouseSobre.emit(true);
    this._prevenirDetener(event);
  }

  // cuando el mouse se va del cuadro
  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any): void {
    this.mouseSobre.emit(false);
  }

  // cuando se suelta el objeto
  @HostListener('drop', ['$event'])
  public onDrop(event: any): void {
    // aqui ya tenemos los archivos
    const transferencia = this._getTransferencia(event);

    if (!transferencia) {
      return;
    }
    this._extraerArchivos(transferencia.files);
    this._prevenirDetener(event);
    this.mouseSobre.emit(false);
  }

  // Hacer la transferencia de Datos
  private _getTransferencia(event: any): any {
    // en algunos navegadores la dataTransfer se encuentra en diferentes sitios, esto es para hacer compatibilidad
    return event.dataTransfer
      ? event.dataTransfer
      : event.originalEvent.dataTransfer;
  }

  private _extraerArchivos(archivosLista: FileList): void {
    // console.log(archivosLista);

    // tslint:disable-next-line: forin
    for (const propiedad in Object.getOwnPropertyNames(archivosLista)) {
      const archivoTemporal = archivosLista[propiedad];

      if (this._archivoPuedeSerCargado(archivoTemporal)) {
        const nuevoArchivo = new FileItem(archivoTemporal);
        this.archivos.push(nuevoArchivo);
      }
    }
  }

  // Validaciones
  private _archivoPuedeSerCargado(archivo: File): boolean {
    if (
      !this._archivoYaFueDroppeado(archivo.name) &&
      this._esImagen(archivo.type)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // prevenir evento por defecto y propagación
  private _prevenirDetener(event): void {
    event.preventDefault();
    event.stopPropagation();
  }
  // saber si el tipo de archivo ya fue droppeado para no droppearlo 2 veces en la mima carga
  private _archivoYaFueDroppeado(nombreArchivo: string): boolean {
    for (const archivo of this.archivos) {
      if (archivo.nombreArchivo === nombreArchivo) {
        alert('el archivo' + nombreArchivo + 'ya esta agregado');
        console.log('el archivo' + nombreArchivo + 'ya esta agregado');
        return true;
      }
    }
    return false;
  }

  // saber si es imagen
  private _esImagen(tipoArchivo: string): boolean {
    return tipoArchivo === '' || tipoArchivo === undefined
      ? false
      : tipoArchivo.startsWith('image');
  }
}
