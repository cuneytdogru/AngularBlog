import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/api/apiResponse';
import { BASE_PATH } from 'src/app/shared/models/constants/base-path';
import { RegisterDto } from 'src/app/shared/models/register/registerDto';
import { UserDto } from 'src/app/shared/models/register/userDto';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly apiPath: string = 'https://localhost';
  private readonly endpoint: string = 'user';

  constructor(
    private httpClient: HttpClient,
    @Inject(BASE_PATH) basePath: string
  ) {
    this.apiPath = basePath;
  }

  async registerUser(registerDto: RegisterDto): Promise<ApiResponse<UserDto>> {
    const response = await firstValueFrom(
      this.httpClient.post<ApiResponse<UserDto>>(
        `${this.apiPath}/${this.endpoint}`,
        registerDto
      )
    );

    return response;
  }
}
