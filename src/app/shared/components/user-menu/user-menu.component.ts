import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from 'src/app/core/user.service';
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
  userFullName$ = this.userService.user$.pipe(map((x) => x.fullName));

  @Output() userNavClose = new EventEmitter();

  constructor(private router: Router, private userService: UserService) {}

  async logout() {
    this.userNavClose.emit();
    this.router.navigate(['/']);

    await this.userService.logout();
  }
}
