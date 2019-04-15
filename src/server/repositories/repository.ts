import { EntityManager, getManager, ObjectType, FindManyOptions, FindConditions, FindOperator } from 'typeorm';

// import EventItem from '../entities/event-item';
import { ListData } from '../../../types';

export type SearchableEntityProperties<T> = Pick<T, { [K in keyof T]: T[K] extends string ? K : never }[keyof T]>;

export interface FetchListOptions<TEntity> {
  skip?: number;
  take?: number;
  order?: { [P in keyof TEntity]?: 'ASC' | 'DESC' | 1 | -1 };
  searchText?: string;
  searchFields?: Array<keyof SearchableEntityProperties<TEntity>>;
}

export default class Repository<TEntity, TPrimaryKey> {
  manager: EntityManager;
  type: ObjectType<TEntity>;

  constructor(type: ObjectType<TEntity>, manager?: EntityManager) {
    this.type = type;

    if (manager) {
      this.manager = manager;
    } else {
      this.manager = getManager();
    }
  }

  async getItems(options?: FetchListOptions<TEntity>) {
    const skip = Math.max(options && typeof options.skip !== 'undefined' ? options.skip : 0, 0);
    const take = Math.min(options && typeof options.take !== 'undefined' ? options.take : 20, 100);

    const queryOptions: FindManyOptions<TEntity> = {};
    if (options && typeof options.skip !== 'undefined') {
      queryOptions.skip = options.skip;
    }
    if (options && typeof options.take !== 'undefined') {
      queryOptions.take = options.take;
    }
    if (options && options.order) {
      queryOptions.order = options.order;
    }

    if (options && options.searchText && options.searchText.trim() && options.searchFields) {
      const filter: FindConditions<TEntity> = {};

      options.searchFields.forEach(key => {
        filter[key] = new FindOperator<FindConditions<string>>('like', options.searchText as string) as any;
      });

      queryOptions.where = filter;
    }

    const repository = this.manager.getRepository(this.type);
    const [ items, totalItems ] = await repository.findAndCount(queryOptions);

    const result: ListData<TEntity> = {
      items,
      skip,
      take,
      totalItems
    };

    return result;
  }

  async getById(_id: TPrimaryKey) {
    const result: TEntity | null = null;

    // TODO: Implement

    return result;
  }
}
