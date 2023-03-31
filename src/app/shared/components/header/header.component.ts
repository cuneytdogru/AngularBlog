import { CommonModule, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { DEFAULT_USER_NAME } from '../../models/constants/default-user-name';
import { SMALL_WIDTH, XSMALL_WIDTH } from '../../models/constants/media-size';
import { APPLICATION_TITLE } from '../../models/constants/title';
import { NavigationMenuComponent } from '../navigation-menu/navigation-menu.component';

@Component({
  standalone: true,
  selector: 'ng-blog-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    NgIf,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
    NavigationMenuComponent,
  ],
})
export class HeaderComponent {
  @Output() userMenuToggled = new EventEmitter();
  @Output() navMenuToggled = new EventEmitter();

  title = APPLICATION_TITLE;
  userFullName = DEFAULT_USER_NAME;

  screenHeight = 0;
  screenWidth = 0;

  showNavMenu = false;

  constructor() {
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;

    if (this.screenWidth > SMALL_WIDTH) this.showNavMenu = true;
    else this.showNavMenu = false;
  }

  toggleUserMenu() {
    this.userMenuToggled.emit();
  }

  toggleNavMenu() {
    this.navMenuToggled.emit();
  }
}
