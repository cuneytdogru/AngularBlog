import { Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DEFAULT_USER_NAME } from '../../models/constants/default-user-name';

@Component({
  standalone: true,
  selector: 'ng-blog-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  imports: [MatIconModule, MatDividerModule],
})
export class UserMenuComponent {
  @Input() userFullName: string = DEFAULT_USER_NAME;
}
