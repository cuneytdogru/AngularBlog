import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  standalone: true,
  selector: 'ng-blog-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  imports: [
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    AsyncPipe,
    FooterComponent,
  ],
})
export class UserMenuComponent {
  userFullName$ = this.authService.userFullName$;

  @Output() userNavClose = new EventEmitter();

  constructor(private router: Router, private authService: AuthService) {}

  async logout() {
    this.userNavClose.emit();
    this.router.navigate(['/']);

    await this.authService.logout();
  }
}
