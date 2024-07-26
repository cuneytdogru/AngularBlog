import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../notification.service';
import { UserService } from '../user.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private notificationService: NotificationService,
    private userService: UserService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.logAndNotifyError(error);

        return throwError(() => error);
      })
    );
  }

  private logAndNotifyError(error: HttpErrorResponse) {
    const statusCode = error.status as HttpStatusCode;
    let errorMessage = error?.error?.errorMessage ?? error?.message;

    switch (statusCode) {
      case HttpStatusCode.Unauthorized:
      case HttpStatusCode.Forbidden:
        console.error(error);
        this.notificationService.showError(errorMessage);
        this.userService.logout();
        break;
      case HttpStatusCode.BadRequest:
        console.warn(error);
        if (error?.error?.result) {
          this.notificationService.showValidationError(
            Object.values(error.error.result).map(
              (x: any) => x.message as string
            )
          );
        } else {
          this.notificationService.showWarning(errorMessage);
        }
        break;
      case HttpStatusCode.InternalServerError:
        console.error(error);
        this.notificationService.showError(
          `Internal server error occurred. Identifier: ${error.error.identifier}`
        );
        break;
      default:
        console.error(error);
        this.notificationService.showError(errorMessage);
        break;
    }
  }
}
