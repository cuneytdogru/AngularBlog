import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from '../spinner.service';
import { finalize } from 'rxjs';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.spinnerService.show();

    return next.handle(req).pipe(finalize(() => this.spinnerService.hide()));
  }
}
