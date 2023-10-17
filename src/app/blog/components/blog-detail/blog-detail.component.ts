import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, map, switchMap, throwError } from 'rxjs';
import { BlogPostComponent } from 'src/app/shared/components/blog-post/blog-post.component';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { PostService } from '../../services/post.service';
import { BlogCommentComponent } from 'src/app/shared/components/blog-comment/blog-comment.component';

@Component({
  standalone: true,
  selector: 'ng-blog-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss'],
  imports: [BlogPostComponent, BlogCommentComponent, AsyncPipe, NgIf],
})
export class BlogDetailComponent {
  private loadedComments = 0;
  private DEFAULT_TAKE = 10;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  post$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const postId = params.get('id') as string;
      return this.postService.getPost(postId);
    }),
    map((response) => {
      if (response.isError) this.router.navigate(['404']);

      return response.result;
    }),
    catchError((err) => {
      this.router.navigate(['404']);
      return throwError(() => err);
    })
  );

  postComments$ = this.post$.pipe(map((x) => x?.comments));

  comments$ = combineLatest([
    this.postComments$,
    this.postService.comments$,
  ]).pipe(map((a) => (a[1].length > 0 ? a[1] : a[0])));

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
      .then(() => (this.loadedComments += this.DEFAULT_TAKE));
  }
}
