import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private DEFAULT_ERROR_MESSAGE = 'An unknown error occurred.';

  constructor(private notificationService: NotificationService) {}

  handleError(wrapperError: any) {
    const error = wrapperError.rejection
      ? wrapperError.rejection
      : wrapperError;

    if (error instanceof HttpErrorResponse) {
      return;
    } else if (error instanceof Error) {
      this.notificationService.showError(error.message);
    } else this.notificationService.showError(this.DEFAULT_ERROR_MESSAGE);

    console.error(error);
  }
}
