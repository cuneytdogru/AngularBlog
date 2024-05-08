import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, firstValueFrom, map, tap } from 'rxjs';
import {
  ApiResponse,
  ApiResponseNoContent,
} from 'src/app/shared/models/api/apiResponse';
import { BASE_PATH } from 'src/app/shared/models/constants/base-path';
import { JwtToken } from '../shared/models/auth/JwtToken';
import { LoginRequestDto } from '../shared/models/auth/loginRequestDto';
import { LoginResponseDto } from '../shared/models/auth/loginResponseDto';
import { DEFAULT_USER_NAME } from '../shared/models/constants/default-user-name';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiPath: string = 'https://localhost';
  private readonly endpoint: string = 'auth';
  private readonly localStorage_Token: string = 'token';

  private _token = new BehaviorSubject<string>('');
  token$ = this._token
    .asObservable()
    .pipe(
      tap((token) =>
        token
          ? localStorage.setItem(this.localStorage_Token, token)
          : localStorage.removeItem(this.localStorage_Token)
      )
    );

  jwtToken$ = this.token$.pipe(
    map((response) => {
      if (!response) return {} as JwtToken;
      else return jwt_decode<JwtToken>(response);
    })
  );

  userFullName$ = this.jwtToken$.pipe(
    map((token: JwtToken) => token.name ?? DEFAULT_USER_NAME)
  );

  isAuthenticated$ = this.jwtToken$.pipe(
    map((token) => token && new Date(token.exp) <= new Date())
  );

  constructor(
    private httpClient: HttpClient,
    @Inject(BASE_PATH) basePath: string
  ) {
    this.apiPath = basePath;

    const storedToken = localStorage.getItem(this.localStorage_Token);
    if (storedToken) this._token.next(storedToken);
  }

  getToken() {
    return this._token.value;
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
    if (token) this._token.next(token);

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
      this._token.next('');
    }
  }
}
