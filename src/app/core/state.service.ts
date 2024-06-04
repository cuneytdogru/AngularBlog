import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApplicationState } from './models/application-state.model';
import { SessionState } from './models/session-state.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private initApplicationState: ApplicationState = {
    token: undefined,
  };

  private initSessionState: SessionState = {
    blogPage: 0,
    lastBlogPostIndex: 0,
  };

  private _applicationState = new BehaviorSubject<ApplicationState>(
    this.initApplicationState
  );
  applicationState$ = this._applicationState.asObservable();

  private _sessionState = new BehaviorSubject<SessionState>(
    this.initSessionState
  );
  sessionState$ = this._sessionState.asObservable();

  constructor() {
    const applicationState = localStorage.getItem('state');
    const sessionState = sessionStorage.getItem('state');

    if (applicationState) {
      this._applicationState.next(
        JSON.parse(applicationState) as ApplicationState
      );
    } else {
      this._applicationState.next(this.initApplicationState);
    }

    if (sessionState) {
      this._sessionState.next(JSON.parse(sessionState) as SessionState);
    } else {
      this._sessionState.next(this.initSessionState);
    }

    this.applicationState$.subscribe((state) => {
      localStorage.setItem('state', JSON.stringify(state));
    });

    this.sessionState$.subscribe((state) => {
      sessionStorage.setItem('state', JSON.stringify(state));
    });
  }

  getBlogPage(): number {
    return this._sessionState.value.blogPage;
  }

  setBlogPage(page: number) {
    this._sessionState.next({ ...this._sessionState.value, blogPage: page });
  }

  getLastBlogPostIndex(): number {
    return this._sessionState.value.lastBlogPostIndex;
  }

  setLastBlogPostIndex(index?: number) {
    this._sessionState.next({
      ...this._sessionState.value,
      lastBlogPostIndex: index ?? 0,
    });
  }

  clearSessionState() {
    this._sessionState.next(this.initSessionState);
  }

  getToken(): string | undefined {
    return this._applicationState.value.token;
  }

  setToken(value?: string) {
    this._applicationState.next({
      ...this._applicationState.value,
      token: value,
    });
  }
}
