import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environment/environment.dev';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalErrorHandler } from './core/global-error-handler';
import { AuthInterceptor } from './core/http-interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/http-interceptors/error.interceptor';
import { SpinnerInterceptor } from './core/http-interceptors/spinner.interceptor';
import { STORE_STATE } from './core/models/angular-blog-store-state.model';
import { provideStore } from './core/store/provider';
import { BASE_PATH } from './shared/models/constants/base-path';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: BASE_PATH, useValue: environment.apiPath },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
    provideStore({ state: STORE_STATE }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
