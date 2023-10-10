import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from 'src/app/shared/components/footer/footer.component';

@Component({
  standalone: true,
  selector: 'ng-blog-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [RouterModule, FooterComponent],
})
export class HomeComponent {}
