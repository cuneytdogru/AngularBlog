import { Component, Input } from '@angular/core';
import { CommentDto } from '../../models/blog/comment/commentDto';
import { DatePipe, NgFor } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'ng-blog-blog-comment',
  templateUrl: './blog-comment.component.html',
  styleUrls: ['./blog-comment.component.scss'],
  imports: [NgFor, MatCardModule, MatIconModule, DatePipe, MatDividerModule],
})
export class BlogCommentComponent {
  @Input() comments: CommentDto[] | undefined = [];

  trackComment(index: number, item: CommentDto) {
    return item.id;
  }
}
