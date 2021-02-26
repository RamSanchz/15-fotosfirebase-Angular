import { Component, OnInit } from '@angular/core';
import { FileItem } from '../../models/file-item';
import { CargaImagenesService } from '../../services/carga-imagenes.service';

@Component({
  selector: 'app-carga',
  templateUrl: './carga.component.html',
  styles: [],
})
export class CargaComponent implements OnInit {
  estaSobreElemento = false;
  archivos: FileItem[] = [];

  constructor(public cargaImagenesService: CargaImagenesService) {}

  ngOnInit(): void {}

  cargarImagenes(): void {
    this.cargaImagenesService.cargarImagenesFirebase(this.archivos);
  }

  limpiarArchivos() {
    this.archivos = [];
  }
}
