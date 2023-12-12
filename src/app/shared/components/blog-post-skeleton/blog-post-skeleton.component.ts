import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatIconModule, MatButtonModule],
  selector: 'ng-blog-blog-post-skeleton',
  templateUrl: './blog-post-skeleton.component.html',
  styleUrls: ['./blog-post-skeleton.component.scss'],
})
export class BlogPostSkeletonComponent {}
