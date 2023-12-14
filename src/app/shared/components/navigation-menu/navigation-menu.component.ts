import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'ng-blog-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
  imports: [
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
    NgClass,
  ],
})
export class NavigationMenuComponent {
  @Input() direction: 'row' | 'column' = 'row';
  @Input() headerText = '';

  @Output() sideNavClose = new EventEmitter();

  closeSideMenu() {
    this.sideNavClose.emit();
  }
}
