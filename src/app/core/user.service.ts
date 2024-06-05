import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { filter, firstValueFrom, map } from 'rxjs';
import {
  ApiResponse,
  ApiResponseNoContent,
} from 'src/app/shared/models/api/apiResponse';
import { BASE_PATH } from 'src/app/shared/models/constants/base-path';
import { JwtToken } from '../shared/models/auth/JwtToken';
import { LoginRequestDto } from '../shared/models/auth/loginRequestDto';
import { LoginResponseDto } from '../shared/models/auth/loginResponseDto';
import { User } from '../shared/models/auth/user';
import { StoreKeys } from './models/store.model';
import { StateService } from './state.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiPath: string = 'https://localhost';
  private readonly endpoint: string = 'auth';

  token$ = this.stateService.applicationState$.pipe(map((x) => x.token));

  jwtToken$ = this.token$.pipe(
    map((response) => {
      if (!response) return undefined;
      else return jwt_decode<JwtToken>(response);
    })
  );

  isAuthenticated$ = this.jwtToken$.pipe(
    map((token) => token && new Date(token.exp) <= new Date())
  );

  user$ = this.jwtToken$.pipe(
    filter(Boolean),
    map((token: JwtToken) => {
      return {
        email: token.email,
        fullName: token.name,
        userName: token.sub,
        id: token.sid,
      } as User;
    })
  );

  constructor(
    private httpClient: HttpClient,
    @Inject(BASE_PATH) basePath: string,
    private stateService: StateService,
    private storeService: StoreService
  ) {
    this.apiPath = basePath;
  }

  getToken() {
    return this.stateService.getToken();
  }

  async login(
    loginDto: LoginRequestDto
  ): Promise<ApiResponse<LoginResponseDto>> {
    const response = await firstValueFrom(
      this.httpClient.post<ApiResponse<LoginResponseDto>>(
        `${this.apiPath}/${this.endpoint}/login`,
        loginDto
      )
    );

    const token = response.result?.token;
    if (token) {
      this.clearSessionStatesAndStore();
      this.stateService.setToken(token);
    }

    return response;
  }

  async logout(): Promise<ApiResponseNoContent> {
    try {
      const response = await firstValueFrom(
        this.httpClient.post<ApiResponseNoContent>(
          `${this.apiPath}/${this.endpoint}/logout`,
          undefined
        )
      );

      return response;
    } finally {
      this.stateService.setToken(undefined);
      this.clearSessionStatesAndStore();
    }
  }

  private clearSessionStatesAndStore() {
    this.stateService.clearSessionState();
    this.storeService.set(StoreKeys.Posts, []);
  }
}
