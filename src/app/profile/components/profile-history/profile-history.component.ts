import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { BlogCommentComponent } from 'src/app/shared/components/blog-comment/blog-comment.component';
import { BlogPostComponent } from 'src/app/shared/components/blog-post/blog-post.component';
import { CommentDto } from 'src/app/shared/models/blog/comment/commentDto';
import { CommentFilter } from 'src/app/shared/models/blog/comment/commentFilter';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { PostFilter } from 'src/app/shared/models/blog/post/postFilter';

@Component({
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatCardModule,
    MatTabsModule,
    BlogPostComponent,
    BlogCommentComponent,
  ],
  selector: 'ng-blog-profile-history',
  templateUrl: './profile-history.component.html',
  styleUrls: ['./profile-history.component.scss'],
})
export class ProfileHistoryComponent {
  @Input() posts?: PostDto[] | null = [];
  @Input() likedPosts?: PostDto[] | null = [];
  @Input() comments?: CommentDto[] | null = [];

  @Output() postsClicked: EventEmitter<PostFilter> =
    new EventEmitter<PostFilter>();

  @Output() commentsClicked: EventEmitter<CommentFilter> =
    new EventEmitter<CommentFilter>();

  @Output() likesClicked: EventEmitter<PostFilter> =
    new EventEmitter<PostFilter>();

  private postFilter = new PostFilter(0, 10);
  private commentFilter = new CommentFilter(0, 10);
  private likeFilter = new PostFilter(0, 10);

  constructor(private router: Router) {}

  onTabChanged(tabChangeEvent: MatTabChangeEvent) {
    switch (tabChangeEvent.index) {
      case 0:
        this.postsClicked.emit(this.postFilter);
        break;
      case 1:
        this.commentsClicked.emit(this.commentFilter);
        break;
      case 2:
        this.likesClicked.emit(this.likeFilter);
    }
  }

  navigateToPost(postId: string) {
    this.router.navigate(['main', 'blog', postId]);
  }

  navigateToProfile(post: PostDto) {
    this.router.navigate(['main', 'profile', post.user.userName]);
  }
}
