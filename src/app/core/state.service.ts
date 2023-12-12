import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApplicationState } from './models/application-state.model';
import { SessionState } from './models/session-state.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private initApplicationState = {
    blogPage: 0,
    blogScroll: 0,
  } as ApplicationState;

  private initSessionState = {
    blogPage: 0,
  } as SessionState;

  private _localState = new BehaviorSubject<ApplicationState>(
    this.initApplicationState
  );
  localState$ = this._localState.asObservable();

  private _sessionState = new BehaviorSubject<SessionState>(
    this.initSessionState
  );
  sessionState$ = this._sessionState.asObservable();

  constructor() {
    const applicationState = localStorage.getItem('state');
    const sessionState = sessionStorage.getItem('state');

    if (applicationState) {
      this._localState.next(JSON.parse(applicationState) as ApplicationState);
    } else {
      this._localState.next(this.initApplicationState);
    }

    if (sessionState) {
      this._sessionState.next(JSON.parse(sessionState) as SessionState);
    } else {
      this._sessionState.next(this.initSessionState);
    }

    this.localState$.subscribe((state) => {
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

  getBlogPostIndex(): number {
    return this._sessionState.value.blogPostIndex;
  }

  setBlogPostIndex(index: number) {
    this._sessionState.next({
      ...this._sessionState.value,
      blogPostIndex: index,
    });
  }

  clearBlogPostIndex() {
    this._sessionState.next({
      ...this._sessionState.value,
      blogPostIndex: 0,
    });
  }
}
