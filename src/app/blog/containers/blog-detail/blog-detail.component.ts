import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, map, switchMap } from 'rxjs';
import { STORE_KEYS } from 'src/app/core/models/angular-blog-store-state.model';
import { NotificationService } from 'src/app/core/notification.service';
import { SpinnerService } from 'src/app/core/spinner.service';
import { Store } from 'src/app/core/store/store';
import { BlogCommentComponent } from 'src/app/shared/components/blog-comment/blog-comment.component';
import { BlogPostComponent } from 'src/app/shared/components/blog-post/blog-post.component';
import { CommentDto } from 'src/app/shared/models/blog/comment/commentDto';
import { CreateCommentDto } from 'src/app/shared/models/blog/comment/createCommentDto';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { BlogCommentFormComponent } from '../../components/blog-comment-form/blog-comment-form.component';
import { PostService } from '../../services/post.service';

@Component({
  standalone: true,
  selector: 'ng-blog-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  imports: [
    BlogPostComponent,
    BlogCommentComponent,
    BlogCommentFormComponent,
    AsyncPipe,
    NgIf,
    NgFor,
    MatDividerModule,
  ],
})
export class BlogDetailComponent {
  private DEFAULT_TAKE = 10;

  @ViewChild(BlogCommentFormComponent) commentForm!: BlogCommentFormComponent;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService,
    private notificationService: NotificationService,
    private store: Store
  ) {}

  postId$ = this.route.paramMap.pipe(
    switchMap(async (params) => {
      const postId = params.get('id') as string;

      const response = await this.postService.getPost(postId);

      if (response.isError) this.router.navigate(['404']);

      return postId;
    })
  );

  post$ = this.postId$.pipe(
    switchMap((postId) => {
      return this.store
        .select<PostDto>(STORE_KEYS.Posts)
        .pipe(map((x) => x.entities[postId]));
    })
  );

  loadedCommentsCount$ = this.post$.pipe(map((x) => x?.comments.length ?? 0));

  isLoading$ = this.spinnerService.visibility$;

  likePost(post: PostDto) {
    this.postService.likePost(post);
  }

  unLikePost(post: PostDto) {
    this.postService.likePost(post, false);
  }

  sharePost(post: PostDto) {
    //TODO: Copy link
  }

  async sendComment(postId: string, commentText: string) {
    const resourcePath = await this.postService.addComment(postId, {
      text: commentText,
    } as CreateCommentDto);

    await this.postService.getCommentFromLocation(resourcePath!);

    this.commentForm.reset();

    this.notificationService.showSuccess('Comment posted.');
  }

  navigateToProfile(post: PostDto) {
    this.router.navigate(['main', 'profile', post.user.userName]);
  }

  navigateToCommentProfile(comment: CommentDto) {
    this.router.navigate(['main', 'profile', comment.user.userName]);
  }

  navigateToOriginalPost(comment: CommentDto) {
    this.router.navigate(['main', 'blog', comment.postId]);
  }

  trackComment(index: number, item: CommentDto) {
    return item.id;
  }

  async loadMoreComments(post: PostDto) {
    const loadedCommentsCount = await firstValueFrom(this.loadedCommentsCount$);

    await this.postService.getComments(post.id, {
      skip: loadedCommentsCount,
      take: this.DEFAULT_TAKE,
    });
  }
}
