import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { SpinnerService } from 'src/app/core/spinner.service';
import { BlogCommentComponent } from 'src/app/shared/components/blog-comment/blog-comment.component';
import { BlogPostComponent } from 'src/app/shared/components/blog-post/blog-post.component';
import { CommentDto } from 'src/app/shared/models/blog/comment/commentDto';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { PostService } from '../../services/post.service';

@Component({
  standalone: true,
  selector: 'ng-blog-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  imports: [
    BlogPostComponent,
    BlogCommentComponent,
    AsyncPipe,
    NgIf,
    NgFor,
    MatDividerModule,
  ],
})
export class BlogDetailComponent implements OnInit {
  private loadedComments = 0;
  private DEFAULT_TAKE = 10;

  private _post$ = new BehaviorSubject<PostDto | undefined>(undefined);
  protected post$ = this._post$.asObservable();

  private _comments$ = new BehaviorSubject<CommentDto[]>([]);
  protected comments$ = this._comments$.asObservable();

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      const postId = params.get('id') as string;

      const response = await this.postService.getPost(postId);

      if (response.isError) this.router.navigate(['404']);

      const post = response.result;

      this._post$.next(post);

      if (post?.comments) this._comments$.next(post.comments);

      this.loadedComments = post?.comments.length ?? 0;
    });
  }

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

  navigateToProfile(post: PostDto) {
    this.router.navigate(['main', 'profile', post.user.userName]);
  }

  trackComment(index: number, item: CommentDto) {
    return item.id;
  }

  loadMoreComments(post: PostDto) {
    this.postService
      .getComments(post.id, {
        skip: this.loadedComments,
        take: this.DEFAULT_TAKE,
      })
      .then((response) => {
        if (response.result?.data) {
          this._comments$.next([
            ...this._comments$.value,
            ...response.result?.data,
          ]);
          this.loadedComments += this.DEFAULT_TAKE;
        }
      });
  }
}
