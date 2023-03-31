import { Component } from '@angular/core';
import { APPLICATION_TITLE } from './shared/models/constants/title';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = APPLICATION_TITLE;
}
