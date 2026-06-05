import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nueva-tienda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nueva-tienda.component.html',
  styleUrls: ['./nueva-tienda.component.css']
})
export class NuevaTiendaComponent {
  formData = {
    nombre: '',
    nit: '',
    direccion: '',
    correo: '',
    telefono: ''
  };

  onSubmit(): void {
    console.log('Nueva tienda:', this.formData);
    // Aquí se implementaría la lógica para guardar la nueva tienda
    alert('Tienda registrada exitosamente (Demo)');
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      nombre: '',
      nit: '',
      direccion: '',
      correo: '',
      telefono: ''
    };
  }
}
