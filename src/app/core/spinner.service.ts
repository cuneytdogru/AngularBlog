import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private _visibility$ = new BehaviorSubject(false);
  visibility$ = this._visibility$.asObservable();

  show() {
    this._visibility$.next(true);
  }

  hide() {
    this._visibility$.next(false);
  }
}
