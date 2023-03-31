import { Component, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
  MatSidenavModule,
} from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { NavigationMenuComponent } from 'src/app/shared/components/navigation-menu/navigation-menu.component';
import { UserMenuComponent } from 'src/app/shared/components/user-menu/user-menu.component';

@Component({
  standalone: true,
  selector: 'ng-blog-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  imports: [
    RouterModule,
    HeaderComponent,
    FooterComponent,
    MatSidenavModule,
    MatDividerModule,
    UserMenuComponent,
    NavigationMenuComponent,
  ],
})
export class MainPageComponent {
  @ViewChild('userMenuDrawer') userMenuDrawer!: MatDrawer;
  @ViewChild('navMenuDrawer') navMenuDrawer!: MatDrawer;

  toggleUserMenu() {
    this.userMenuDrawer.toggle();
  }

  toggleNavMenu() {
    this.navMenuDrawer.toggle();
  }

  closenavMenu() {
    this.navMenuDrawer.close();
  }
}
