import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  Subject,
  catchError,
  combineLatest,
  map,
  merge,
  switchMap,
  throwError,
} from 'rxjs';
import { BlogPostComponent } from 'src/app/shared/components/blog-post/blog-post.component';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { PostService } from '../../services/post.service';
import { BlogCommentComponent } from 'src/app/shared/components/blog-comment/blog-comment.component';
import { SpinnerService } from 'src/app/core/spinner.service';
import { CommentDto } from 'src/app/shared/models/blog/comment/commentDto';

@Component({
  standalone: true,
  selector: 'ng-blog-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  imports: [BlogPostComponent, BlogCommentComponent, AsyncPipe, NgIf],
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
