import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/api/apiResponse';
import { PagedResponse } from 'src/app/shared/models/api/pagedResponse';
import { PostDto } from 'src/app/shared/models/blog/post/postDto';
import { PostFilter } from 'src/app/shared/models/blog/post/postFilter';
import { BASE_PATH } from 'src/app/shared/models/constants/base-path';
import { ProfileDto } from 'src/app/shared/models/user/profileDto';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiPath: string = 'https://localhost';
  private readonly endpoint: string = 'profile';

  constructor(
    private httpClient: HttpClient,
    @Inject(BASE_PATH) basePath: string
  ) {
    this.apiPath = basePath;
  }

  async getProfileByUserName(
    userName: string
  ): Promise<ApiResponse<ProfileDto>> {
    if (!userName) throw new Error('Username is empty,null or undefined');

    const response = await firstValueFrom(
      this.httpClient.get<ApiResponse<ProfileDto>>(
        `${this.apiPath}/${this.endpoint}?userName=${userName}`
      )
    );

    return response;
  }

  async getProfilePosts(
    userName: string,
    filter: PostFilter = new PostFilter()
  ): Promise<PagedResponse<PostDto, PostFilter>> {
    if (!userName) throw new Error('Username is empty,null or undefined');

    filter.userName = userName;

    let localVarQueryParameters = new HttpParams({});

    if (filter.userName !== undefined && filter.userName !== null) {
      localVarQueryParameters = localVarQueryParameters.append(
        'userName',
        filter.userName
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
      this.httpClient.get<ApiResponse<PagedResponse<PostDto, PostFilter>>>(
        `${this.apiPath}/${this.endpoint}/posts`,
        {
          params: localVarQueryParameters,
        }
      )
    );

    return response!.result!;
  }

  async getProfileLikes(
    userName: string,
    filter: PostFilter = new PostFilter()
  ): Promise<PagedResponse<PostDto, PostFilter>> {
    if (!userName) throw new Error('Username is empty,null or undefined');

    filter.likedByUserName = userName;

    let localVarQueryParameters = new HttpParams({});

    if (
      filter.likedByUserName !== undefined &&
      filter.likedByUserName !== null
    ) {
      localVarQueryParameters = localVarQueryParameters.append(
        'likedByUserName',
        filter.likedByUserName
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
      this.httpClient.get<ApiResponse<PagedResponse<PostDto, PostFilter>>>(
        `${this.apiPath}/${this.endpoint}/posts`,
        {
          params: localVarQueryParameters,
        }
      )
    );

    return response!.result!;
  }
}
