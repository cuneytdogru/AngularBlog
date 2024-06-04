import { PostDto } from 'src/app/shared/models/blog/post/postDto';

export enum StoreKeys {
  Posts = 'posts',
}

const Keys = StoreKeys;

export interface Store {
  [Keys.Posts]: PostDto[];
}
