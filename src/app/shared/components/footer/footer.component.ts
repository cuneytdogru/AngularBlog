import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  standalone: true,
  selector: 'ng-blog-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [MatDividerModule],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
