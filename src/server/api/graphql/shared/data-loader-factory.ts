import DataLoader from 'dataloader';
import { ObjectType } from 'typeorm';

export default class DataLoaderFactory {
  cache = new Map<string, any>();

  getDataLoader<TEntity, TKey>(type: ObjectType<TEntity>, name: string, fetcher: DataLoader.BatchLoadFn<TKey, TEntity>) {
    const typeName = `${type.name}_${name}`;
    let dataLoader = this.cache.get(typeName);

    if (!dataLoader) {
      dataLoader = new DataLoader<TKey, TEntity>(fetcher);

      this.cache.set(typeName, dataLoader);
    }

    return dataLoader as DataLoader<TKey, TEntity>;
  }

  getDataSetLoader<TEntity, TKey>(type: ObjectType<TEntity>, name: string, fetcher: DataLoader.BatchLoadFn<TKey, TEntity[]>) {
    const typeName = `${type.name}_${name}`;
    let dataLoader = this.cache.get(typeName);

    if (!dataLoader) {
      dataLoader = new DataLoader<TKey, TEntity[]>(fetcher);

      this.cache.set(typeName, dataLoader);
    }

    return dataLoader as DataLoader<TKey, TEntity[]>;
  }

  clear() {
    this.cache.clear();
  }
}
