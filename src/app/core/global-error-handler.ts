import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { NotificationService } from './notification.service';
import { ApiResponse, BaseApiResponse } from '../shared/models/api/apiResponse';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private DEFAULT_ERROR_MESSAGE = 'An unknown error occured.';

  constructor(private notificationService: NotificationService) {}

  handleError(wrapperError: any) {
    const error = wrapperError.rejection
      ? wrapperError.rejection
      : wrapperError;

    if (error instanceof HttpErrorResponse) {
      if (error.error) {
        const apiResponse = error.error as BaseApiResponse;

        if (apiResponse.errorMessage)
          this.notificationService.showError(apiResponse.errorMessage);
        else this.notificationService.showError(this.DEFAULT_ERROR_MESSAGE);
      } else this.notificationService.showError(error.message);
    } else if (error instanceof Error) {
      this.notificationService.showError(error.message);
    } else this.notificationService.showError(this.DEFAULT_ERROR_MESSAGE);

    console.error(error);
  }
}
