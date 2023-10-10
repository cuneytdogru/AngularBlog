import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_USER_NAME } from '../../models/constants/default-user-name';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { JwtToken } from '../../models/auth/JwtToken';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'ng-blog-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  imports: [MatIconModule, MatDividerModule, MatButtonModule, AsyncPipe],
})
export class UserMenuComponent {
  userFullName$ = this.authService.userFullName$;

  @Output() userNavClose = new EventEmitter();

  constructor(private router: Router, private authService: AuthService) {}

  async logout() {
    await this.authService.logout();

    this.router.navigate(['/']);
    this.userNavClose.emit();
  }
}
