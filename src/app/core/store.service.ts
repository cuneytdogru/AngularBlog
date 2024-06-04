import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs';
import { Store, StoreKeys } from './models/store.model';

const store: Store = {
  posts: [],
};

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private _store = new BehaviorSubject<Store>(store);
  store$ = this._store.asObservable().pipe(distinctUntilChanged());

  get value() {
    return this._store.value;
  }

  select<T>(name: StoreKeys): Observable<T> {
    return this.store$.pipe(map((x) => x[name as keyof Store] as T));
  }

  set(name: StoreKeys, state: any) {
    this._store.next({
      ...this._store.value,
      [name]: state,
    });
  }
}
