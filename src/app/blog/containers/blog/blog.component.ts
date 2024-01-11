import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Subject } from 'rxjs';
import { SpinnerService } from 'src/app/core/spinner.service';
import { StateService } from 'src/app/core/state.service';
import { BlogPostSkeletonComponent } from 'src/app/shared/components/blog-post-skeleton/blog-post-skeleton.component';
import { BlogPostComponent } from 'src/app/shared/components/blog-post/blog-post.component';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { DEFAULT_TAKE } from 'src/app/shared/models/constants/filter';
import { Append } from '../../models/append.enum';
import { PostService } from '../../services/post.service';

@Component({
  standalone: true,
  selector: 'ng-blog-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    BlogPostComponent,
    InfiniteScrollModule,
    BlogPostSkeletonComponent,
  ],
})
export class BlogComponent implements AfterViewInit {
  throttle = 300;
  scrollDistance = 2;
  page = 0;
  size = DEFAULT_TAKE;

  destroying$ = new Subject<boolean>();
  posts$ = this.postService.posts$;
  isLoading$ = this.spinnerService.visibility$;

  @ViewChildren('posts', { read: ElementRef })
  postElements!: QueryList<ElementRef>;

  constructor(
    private postService: PostService,
    private router: Router,
    private spinnerService: SpinnerService,
    private stateService: StateService
  ) {
    if (!postService.isInitialized) {
      this.stateService.clearBlogPostIndex();
      this.postService.getPosts({ skip: this.page, take: this.size });
    } else {
      if (this.stateService.getBlogPage())
        this.page = this.stateService.getBlogPage();
    }
  }

  ngAfterViewInit(): void {
    this.scrollToLastPost();
  }

  private scrollToLastPost() {
    const index = this.stateService.getBlogPostIndex();

    if (index) {
      this.scrollToPost(index);
    }
  }

  private scrollToPost(index: number): void {
    const lastPostElement = this.postElements?.toArray()[index].nativeElement;

    setTimeout(() => {
      lastPostElement.scrollIntoView({ block: 'center' });
    }, 0);
  }

  onScroll() {
    this.page += this.size;
    this.stateService.setBlogPage(this.page);

    this.postService.getPosts({ skip: this.page, take: this.size });
  }

  onScrollUp() {
    this.page = this.page - this.size;

    if (this.page < 0)
      if (this.page > this.size * -1) this.page = 0;
      else return;

    this.stateService.setBlogPage(this.page);

    this.postService.getPosts({ skip: this.page, take: this.size }, Append.Top);
  }

  trackPost(index: number, item: PostDto) {
    return item.id;
  }

  likePost(post: PostDto) {
    this.postService.likePost(post);
  }

  unLikePost(post: PostDto) {
    this.postService.likePost(post, false);
  }

  sharePost(post: PostDto) {
    //TODO: Copy link
  }

  navigateToPost(post: PostDto, index: number) {
    this.stateService.setBlogPostIndex(index);
    this.stateService.setBlogPage(this.page);
    this.router.navigate(['main', 'blog', post.id]);
  }

  navigateToProfile(post: PostDto, index: number) {
    this.stateService.setBlogPostIndex(index);
    this.stateService.setBlogPage(this.page);
    this.router.navigate(['main', 'profile', post.user.userName]);
  }
}
