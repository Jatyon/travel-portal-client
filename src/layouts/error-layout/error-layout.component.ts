import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './error-layout.component.html',
  styleUrls: ['./error-layout.component.scss'],
})
export class ErrorLayoutComponent {}
