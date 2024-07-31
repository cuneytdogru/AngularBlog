import { NgFor } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarModule,
  MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
  selector: 'ng-blog-validation-error',
  templateUrl: './validation-error.component.html',
  styleUrls: ['./validation-error.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatSnackBarModule, NgFor, MatDividerModule],
})
export class ValidationErrorComponent {
  snackBarRef = inject(MatSnackBarRef);
  messages: string[] = [];

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
    if (data.messages) this.messages = data.messages;
  }
}
