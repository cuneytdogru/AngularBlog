import { EntityAdapter } from './entity-adapter';
import { IdSelector } from './models';
import { StoreAdapter } from './store-adapter';

export function createEntityAdapter<T>(
  selectId?: IdSelector<T>
): EntityAdapter<T> {
  selectId = selectId ?? ((entity: any) => entity.id);

  return new EntityAdapter<T>(selectId);
}

export function createStoreAdapter<T>(
  storeKey: string,
  selectId?: IdSelector<T>
): StoreAdapter<T> {
  selectId = selectId ?? ((entity: any) => entity.id);

  return new StoreAdapter<T>(storeKey, selectId);
}
