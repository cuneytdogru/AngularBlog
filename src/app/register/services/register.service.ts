import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  ApiResponse,
  ApiResponseNoContent,
} from 'src/app/shared/models/api/apiResponse';
import { BASE_PATH } from 'src/app/shared/models/constants/base-path';
import { RegisterUserRequestDto } from 'src/app/shared/models/user/RegisterUserRequestDto';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private readonly apiPath: string;
  private readonly endpoint: string = 'register';

  constructor(
    private httpClient: HttpClient,
    @Inject(BASE_PATH) basePath: string
  ) {
    this.apiPath = basePath;
  }

  async registerUser(
    registerDto: RegisterUserRequestDto
  ): Promise<ApiResponseNoContent> {
    const response = await firstValueFrom(
      this.httpClient.post<ApiResponseNoContent>(
        `${this.apiPath}/${this.endpoint}`,
        registerDto
      )
    );

    return response;
  }

  async checkUsername(username: string): Promise<ApiResponse<boolean>> {
    const response = await firstValueFrom(
      this.httpClient.get<ApiResponse<boolean>>(
        `${this.apiPath}/${this.endpoint}/check-username?username=${username}`
      )
    );

    return response;
  }

  async checkEmail(email: string): Promise<ApiResponse<boolean>> {
    const response = await firstValueFrom(
      this.httpClient.get<ApiResponse<boolean>>(
        `${this.apiPath}/${this.endpoint}/check-email?email=${email}`
      )
    );

    return response;
  }
}
