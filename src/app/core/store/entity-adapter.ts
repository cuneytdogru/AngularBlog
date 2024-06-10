import { Predicate } from '@angular/core';
import { BaseDto } from 'src/app/shared/models/api/baseDto';
import { EntityMapOne, EntityState, IdSelector, Update } from './models';
import { selectIdValue } from './utils';

export class EntityAdapter<T> {
  constructor(private selectId: IdSelector<T>) {}

  addOne(entity: T, state: EntityState<T>) {
    const key = selectIdValue(entity, this.selectId);

    if (key in state.entities) return;

    state.ids.push(key);
    state.entities[key] = entity;
  }

  addMany(entities: T[], state: EntityState<T>) {
    for (const entity of entities) this.addOne(entity, state);
  }

  setAll(entities: T[], state: EntityState<T>) {
    state.ids = [];
    state.entities = {};

    this.addMany(entities, state);
  }

  setOne(entity: T, state: EntityState<T>) {
    const key = selectIdValue(entity, this.selectId);

    if (key in state.entities) {
      state.entities[key] = entity;
    }

    state.ids.push(key);
    state.entities[key] = entity;
  }

  setMany(entities: T[], state: EntityState<T>) {
    entities.map((entity) => this.setOne(entity, state));
  }

  removeOne(key: string | number, state: EntityState<T>) {
    return this.removeMany([key], state);
  }

  removeMany(keysOrPredicate: any[] | Predicate<T>, state: EntityState<T>) {
    const keys =
      keysOrPredicate instanceof Array
        ? keysOrPredicate
        : state.ids.filter((key: any) => keysOrPredicate(state.entities[key]!));

    const didMutate =
      keys
        .filter((key: any) => key in state.entities)
        .map((key: any) => delete state.entities[key]).length > 0;

    if (didMutate) {
      state.ids = state.ids.filter((id: any) => id in state.entities);
    }
  }

  removeAll(state: EntityState<T>) {
    return Object.assign({}, state, {
      ids: [],
      entities: {},
    });
  }

  private takeNewKey(
    keys: { [id: string]: any },
    update: Update<T>,
    state: EntityState<T>
  ): boolean {
    const original = state.entities[update.id];
    const updated: T = Object.assign({}, original, update.changes);
    const newKey = selectIdValue(updated, this.selectId);
    const hasNewKey = newKey !== update.id;

    if (hasNewKey) {
      keys[update.id] = newKey;
      delete state.entities[update.id];
    }

    state.entities[newKey] = updated;

    return hasNewKey;
  }

  updateOne(update: Update<T>, state: EntityState<T>) {
    return this.updateMany([update], state);
  }

  updateMany(updates: Update<T>[], state: EntityState<T>) {
    updates = updates.filter((update) => update.id in state.entities);

    const didMutateEntities = updates.length > 0;

    if (didMutateEntities) {
      const newKeys: { [id: string]: string } = {};

      const didMutateIds =
        updates.filter((update) => this.takeNewKey(newKeys, update, state))
          .length > 0;

      if (didMutateIds)
        state.ids = state.ids.map((id: any) => newKeys[id] || id);
    }
  }

  upsertOne(entity: T, state: EntityState<T>) {
    this.upsertMany([entity], state);
  }

  upsertMany(entities: T[], state: EntityState<T>) {
    const added: any[] = [];
    const updated: any[] = [];

    for (const entity of entities) {
      const id = selectIdValue(entity, this.selectId);
      if (id in state.entities) {
        updated.push({ id, changes: entity });
      } else {
        added.push(entity);
      }
    }

    this.updateMany(updated, state);
    this.addMany(added, state);
  }

  mapOne(map: EntityMapOne<T>, state: EntityState<T>) {
    const entity = state.entities[map.id];
    if (!entity) return;

    const updatedEntity = map.map(entity);
    return this.updateOne(
      {
        id: map.id as any,
        changes: updatedEntity,
      },
      state
    );
  }

  public uniqueAndSort<T extends BaseDto>(data: T[]): T[] {
    return this.sort(this.unique(data));
  }

  public unique<T extends BaseDto>(data: T[]): T[] {
    return data.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i);
  }

  public sort<T extends BaseDto>(data: T[]): T[] {
    return data.sort(
      (a, b) => +new Date(b.createdDate) - +new Date(a.createdDate)
    );
  }
}
