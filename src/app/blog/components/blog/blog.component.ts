import { AsyncPipe, NgFor, NgForOf, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import {
  InfiniteScrollDirective,
  InfiniteScrollModule,
} from 'ngx-infinite-scroll';
import { Subject, filter, takeUntil } from 'rxjs';
import { BlogPostComponent } from 'src/app/shared/components/blog-post/blog-post.component';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { DEFAULT_TAKE } from 'src/app/shared/models/constants/filter';
import { PostService } from '../../services/post.service';

@Component({
  standalone: true,
  selector: 'ng-blog-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  imports: [NgIf, NgFor, AsyncPipe, BlogPostComponent, InfiniteScrollModule],
})
export class BlogComponent implements OnInit {
  throttle = 300;
  scrollDistance = 2;

  page = 0;
  size = DEFAULT_TAKE;

  posts$ = this.postService.posts$;

  constructor(private postService: PostService, private router: Router) {}

  ngOnInit(): void {
    if (!this.postService.isInitialized)
      this.postService.getPosts({ skip: 0, take: this.size });
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

  navigateToPost(post: PostDto) {
    this.router.navigate(['main', 'blog', post.id]);
  }

  onScroll() {
    this.page += this.size;
    this.postService.getPosts({ skip: this.page, take: this.size });
  }
}
