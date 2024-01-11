import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  distinctUntilChanged,
  firstValueFrom,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { ProfileCardComponent } from 'src/app/shared/components/profile-card/profile-card.component';
import { CommentDto } from 'src/app/shared/models/blog/comment/commentDto';
import { CommentFilter } from 'src/app/shared/models/blog/comment/commentFilter';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { PostFilter } from 'src/app/shared/models/blog/post/postFilter';
import { ProfileDto } from 'src/app/shared/models/user/profileDto';
import { ProfileHistoryComponent } from '../../components/profile-history/profile-history.component';
import { ProfileService } from '../../services/profile.service';

@Component({
  standalone: true,
  imports: [ProfileCardComponent, ProfileHistoryComponent, AsyncPipe],
  selector: 'ng-blog-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService
  ) {}

  private _posts = new BehaviorSubject<PostDto[]>([]);
  protected posts$ = this._posts.asObservable();

  private _comments = new BehaviorSubject<CommentDto[]>([]);
  protected comments$ = this._comments.asObservable();

  private _likes = new BehaviorSubject<PostDto[]>([]);
  protected likes$ = this._likes.asObservable();

  private _profile?: ProfileDto;

  profile$ = this.route.paramMap.pipe(
    map((params) => params.get('userName')),
    tap(console.log),
    distinctUntilChanged(),
    switchMap(async (userName) => {
      const response = await this.profileService.getProfileByUserName(
        userName as string
      );

      if (response.isError) this.router.navigate(['404']);

      this.loadPosts(response.result!, new PostFilter(0, 10));

      this._profile = response.result;

      return response.result!;
    })
  );

  private async loadPosts(profile: ProfileDto, filter: PostFilter) {
    const response = await this.profileService.getProfilePosts(
      profile.userName,
      filter
    );

    this._posts.next([...this._posts.value, ...response.data]);
  }

  private async loadComments(profile: ProfileDto, filter: CommentFilter) {
    const response = await this.profileService.getProfileComments(
      profile.userName,
      filter
    );

    this._comments.next([...this._comments.value, ...response.data]);
  }

  private async loadLikes(profile: ProfileDto, filter: PostFilter) {
    const response = await this.profileService.getProfileLikes(
      profile.userName,
      filter
    );

    this._likes.next([...this._likes.value, ...response.data]);
  }

  async onPostsClicked(filter: PostFilter) {
    const posts = await firstValueFrom(this.posts$);

    if (posts.length === 0) await this.loadPosts(this._profile!, filter);
  }

  async onCommentsClicked(filter: CommentFilter) {
    const comments = await firstValueFrom(this.comments$);

    if (comments.length === 0) await this.loadComments(this._profile!, filter);
  }

  async onLikesClicked(filter: PostFilter) {
    const likes = await firstValueFrom(this.likes$);

    if (likes.length === 0) await this.loadLikes(this._profile!, filter);
  }
}
