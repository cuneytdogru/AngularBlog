import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private posX: MatSnackBarHorizontalPosition = 'center';
  private posY: MatSnackBarVerticalPosition = 'bottom';

  constructor(public snackBar: MatSnackBar) {}

  dismiss() {
    this.snackBar.dismiss();
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'X', {
      panelClass: ['success-snackbar'],
      verticalPosition: this.posY,
      horizontalPosition: this.posX,
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'X', {
      panelClass: ['error-snackbar'],
      verticalPosition: this.posY,
      horizontalPosition: this.posX,
    });
  }
}
