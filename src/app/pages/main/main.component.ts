import { Component, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { NavigationMenuComponent } from 'src/app/shared/components/navigation-menu/navigation-menu.component';
import { UserMenuComponent } from 'src/app/shared/components/user-menu/user-menu.component';

@Component({
  standalone: true,
  selector: 'ng-blog-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
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
export class MainComponent {
  @ViewChild('userMenuDrawer') userMenuDrawer!: MatDrawer;
  @ViewChild('navMenuDrawer') navMenuDrawer!: MatDrawer;

  toggleUserMenu() {
    this.userMenuDrawer.toggle();
  }

  toggleNavMenu() {
    this.navMenuDrawer.toggle();
  }

  closeNavMenu() {
    this.navMenuDrawer.close();
  }

  closeUserMenu() {
    this.userMenuDrawer.close();
  }
}
