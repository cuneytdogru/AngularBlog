import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { ProfileDto } from 'src/app/shared/models/user/profileDto';
import { getInitialEntityState } from '../store/entity-state';
import { State } from '../store/models';

export enum StoreKey {
  Posts = 'posts',
  Profiles = 'profiles',
}

class AngularBlogStoreState implements State {
  'posts' = getInitialEntityState<PostDto>();
  'profiles' = getInitialEntityState<ProfileDto>();
}

export const STORE_KEYS = StoreKey;
export const STORE_STATE = new AngularBlogStoreState();
