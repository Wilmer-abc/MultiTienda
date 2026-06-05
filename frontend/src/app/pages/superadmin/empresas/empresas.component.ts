import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockDataService, Empresa } from '../../../core/services/mock-data.service';

@Component({
  selector: 'app-empresas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent {
  empresas: Empresa[] = [];

  constructor(private mockDataService: MockDataService) {
    this.empresas = this.mockDataService.EMPRESAS_MOCK;
  }
}
