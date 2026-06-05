import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ajustes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ajustes.component.html',
  styleUrls: ['./ajustes.component.css']
})
export class AjustesComponent {
  settings = {
    notificaciones: true,
    modoOscuro: true,
    idioma: 'es',
    zonaHoraria: 'America/Guatemala'
  };

  toggleNotificaciones(): void {
    this.settings.notificaciones = !this.settings.notificaciones;
  }

  toggleModoOscuro(): void {
    this.settings.modoOscuro = !this.settings.modoOscuro;
  }

  guardarCambios(): void {
    console.log('Ajustes guardados:', this.settings);
    alert('Ajustes guardados exitosamente (Demo)');
  }
}
