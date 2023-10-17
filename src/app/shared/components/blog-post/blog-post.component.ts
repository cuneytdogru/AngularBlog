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
  private _post: PostDto | undefined;

  get post(): PostDto | undefined {
    return this._post;
  }

  @Input() set post(value: PostDto | undefined) {
    this._post = value;

    this.isLiked = value?.isLikedByCurrentUser ?? false;
  }

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
      this.post.totalLikes++;
    } else {
      this.isLiked = false;
      this.postUnliked.emit(this.post);

      if (this.post.totalLikes > 0) this.post.totalLikes--;
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
