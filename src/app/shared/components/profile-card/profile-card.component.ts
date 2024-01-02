import { DatePipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileDto } from '../../models/user/profileDto';
import { BlogCommentComponent } from '../blog-comment/blog-comment.component';
import { BlogPostComponent } from '../blog-post/blog-post.component';

@Component({
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    DatePipe,
    MatTabsModule,
    BlogPostComponent,
    BlogCommentComponent,
  ],
  selector: 'ng-blog-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss'],
})
export class ProfileCardComponent {
  @Input() profile?: ProfileDto | null;

  goBack() {
    window.history.back();
  }
}
