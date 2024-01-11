import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommentDto } from '../../models/blog/comment/commentDto';

@Component({
  standalone: true,
  selector: 'ng-blog-blog-comment',
  templateUrl: './blog-comment.component.html',
  styleUrls: ['./blog-comment.component.scss'],
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatIconModule,
    DatePipe,
    MatDividerModule,
  ],
})
export class BlogCommentComponent {
  @Input() comment?: CommentDto = undefined;
  @Output() profileClicked: EventEmitter<CommentDto> = new EventEmitter();
  @Output() postClicked: EventEmitter<CommentDto> = new EventEmitter();

  goToProfile() {
    this.profileClicked.emit(this.comment);
  }

  goToPost() {
    this.postClicked.emit(this.comment);
  }
}
