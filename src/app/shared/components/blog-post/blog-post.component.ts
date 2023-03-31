import { DatePipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { PostDto } from '../../models/blog/post/postDto';
import { BlogCommentComponent } from '../blog-comment/blog-comment.component';

@Component({
  standalone: true,
  selector: 'ng-blog-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  imports: [
    NgIf,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    DatePipe,
    BlogCommentComponent,
  ],
})
export class BlogPostComponent {
  @Input() post: PostDto | undefined = undefined;
  @Input() showBackButton: boolean = false;
  @Input() showCommentPreview: boolean = false;

  @Output() goToDetails: EventEmitter<PostDto> = new EventEmitter();
  @Output() postLiked: EventEmitter<PostDto> = new EventEmitter();
  @Output() postUnliked: EventEmitter<PostDto> = new EventEmitter();
  @Output() postShared: EventEmitter<PostDto> = new EventEmitter();

  protected isLiked = false;

  like() {
    if (!this.post) return;

    if (!this.isLiked) {
      this.isLiked = true;
      this.postLiked.emit(this.post);
      this.post.likes++;
    } else {
      this.isLiked = false;
      this.postUnliked.emit(this.post);

      if (this.post.likes > 0) this.post.likes--;
    }
  }

  share() {
    this.postLiked.emit(this.post);
  }

  showDetails() {
    this.goToDetails.emit(this.post);
  }

  goBack() {
    window.history.back();
  }
}
