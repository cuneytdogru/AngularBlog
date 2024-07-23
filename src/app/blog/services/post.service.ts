import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { createStoreAdapter } from 'src/app/core/store/create-adapter';
import { Comparer } from 'src/app/core/store/models';
import {
  ApiResponse,
  ApiResponseNoContent,
} from 'src/app/shared/models/api/apiResponse';
import { PagedResponse } from 'src/app/shared/models/api/pagedResponse';
import { CommentDto } from 'src/app/shared/models/blog/comment/commentDto';
import { CommentFilter } from 'src/app/shared/models/blog/comment/commentFilter';
import { CreateCommentRequestDto } from 'src/app/shared/models/blog/comment/createCommentRequestDto';
import { CreatePostRequestDto } from 'src/app/shared/models/blog/post/createPostDto';
import { LikePostRequestDto } from 'src/app/shared/models/blog/post/likePostDto';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { PostFilter } from 'src/app/shared/models/blog/post/postFilter';
import { BASE_PATH } from 'src/app/shared/models/constants/base-path';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly apiPath: string = 'https://localhost';
  private readonly endpoint: string = 'post';

  private readonly postSorter: Comparer<PostDto> = (a, b) =>
    +new Date(b?.createdDate ?? '') - +new Date(a?.createdDate ?? '');

  private readonly commentSorter: Comparer<CommentDto> = (a, b) =>
    +new Date(b?.createdDate ?? '') - +new Date(a?.createdDate ?? '');

  private readonly storeAdapter = createStoreAdapter<PostDto>(
    'posts',
    undefined,
    this.postSorter
  );

  constructor(
    private httpClient: HttpClient,
    @Inject(BASE_PATH) basePath: string
  ) {
    this.apiPath = basePath;
  }

  posts$ = this.storeAdapter.entities$;

  async getPosts(filter: PostFilter) {
    let localVarQueryParameters = new HttpParams({});

    if (filter.skip !== undefined && filter.skip !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'skip',
        filter.skip
      );
    }
    if (filter.take !== undefined && filter.take !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'take',
        filter.take
      );
    }
    if (filter.orderBy !== undefined && filter.orderBy !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'orderBy',
        filter.orderBy
      );
    }

    const response = await firstValueFrom(
      this.httpClient.get<ApiResponse<PagedResponse<PostDto, PostFilter>>>(
        `${this.apiPath}/${this.endpoint}`,
        {
          params: localVarQueryParameters,
        }
      )
    );

    this.storeAdapter.upsertMany(response!.result!.data);

    return response;
  }

  async getPost(id: string) {
    const response = await firstValueFrom(
      this.httpClient.get<ApiResponse<PostDto>>(
        `${this.apiPath}/${this.endpoint}/${encodeURIComponent(String(id))}`
      )
    );

    this.storeAdapter.upsertOne(response!.result!);

    return response;
  }

  async getPostFromLocation(location: string) {
    const response = await firstValueFrom(
      this.httpClient.get<ApiResponse<PostDto>>(location)
    );

    await this.storeAdapter.upsertOne(response!.result!);

    return response;
  }

  async getCommentFromLocation(location: string) {
    const response = await firstValueFrom(
      this.httpClient.get<ApiResponse<CommentDto>>(location)
    );

    this.mapComment(response!.result!.postId, response!.result!);

    return response;
  }

  async createPost(postDto: CreatePostRequestDto): Promise<string | null> {
    const response = await firstValueFrom(
      this.httpClient.post<ApiResponseNoContent>(
        `${this.apiPath}/${this.endpoint}`,
        postDto,
        { observe: 'response' }
      )
    );

    return response.headers.get('location');
  }

  async likePost(post: PostDto, isLiked: boolean = true) {
    const likePostDto = { isLiked: isLiked } as LikePostRequestDto;

    const response = await firstValueFrom(
      this.httpClient.put<ApiResponseNoContent>(
        `${this.apiPath}/${this.endpoint}/${encodeURIComponent(
          String(post.id)
        )}/like`,
        likePostDto
      )
    );

    post.isLiked = isLiked;

    await this.storeAdapter.updateOne({ id: post.id, changes: post });

    return response;
  }

  async deletePost(id: string) {
    const response = await firstValueFrom(
      this.httpClient.delete<ApiResponseNoContent>(
        `${this.apiPath}/${this.endpoint}/${encodeURIComponent(String(id))}`
      )
    );

    await this.storeAdapter.removeOne(id);

    return response;
  }

  async addComment(postId: string, comment: CreateCommentRequestDto) {
    const response = await firstValueFrom(
      this.httpClient.post<ApiResponseNoContent>(
        `${this.apiPath}/${this.endpoint}/${encodeURIComponent(
          String(postId)
        )}/comments`,
        comment,
        { observe: 'response' }
      )
    );

    return response.headers.get('location');
  }

  async getComments(postId: string, filter: CommentFilter) {
    let localVarQueryParameters = new HttpParams({});

    if (filter.showHidden !== undefined && filter.showHidden !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'showHidden',
        filter.showHidden
      );
    }

    if (filter.skip !== undefined && filter.skip !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'skip',
        filter.skip
      );
    }

    if (filter.take !== undefined && filter.take !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'take',
        filter.take
      );
    }
    if (filter.orderBy !== undefined && filter.orderBy !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'orderBy',
        filter.orderBy
      );
    }

    const response = await firstValueFrom(
      this.httpClient.get<
        ApiResponse<PagedResponse<CommentDto, CommentFilter>>
      >(`${this.apiPath}/${this.endpoint}/${postId}/comments`, {
        params: localVarQueryParameters,
      })
    );

    this.mapComments(postId, response!.result!.data);

    return response;
  }

  private mapComment(postId: string, comment: CommentDto) {
    this.mapComments(postId, [comment]);
  }

  private async mapComments(postId: string, comments: CommentDto[]) {
    this.storeAdapter.mapOne({
      id: postId,
      map: (entity) => {
        return {
          ...entity,
          comments: [...entity.comments, ...comments].sort(this.commentSorter),
        };
      },
    });
  }
}
