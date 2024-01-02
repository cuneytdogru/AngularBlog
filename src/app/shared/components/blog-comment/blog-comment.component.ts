import { DatePipe, NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommentDto } from '../../models/blog/comment/commentDto';

@Component({
  standalone: true,
  selector: 'ng-blog-blog-comment',
  templateUrl: './blog-comment.component.html',
  styleUrls: ['./blog-comment.component.scss'],
  imports: [NgFor, MatCardModule, MatIconModule, DatePipe, MatDividerModule],
})
export class BlogCommentComponent {
  @Input() comment?: CommentDto | null = undefined;
}
