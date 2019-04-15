import { EntityManager, getManager, ObjectType, FindManyOptions, FindConditions, FindOperator, ObjectID } from 'typeorm';

import { ListData, FetchListOptions } from '../../../types';

export default class Repository<TEntity, TPrimaryKey = string | number | Date | ObjectID> {
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

    const queryOptions: FindManyOptions<TEntity> = {
      skip,
      take
    };

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
    const [items, totalItems] = await repository.findAndCount(queryOptions);

    const result: ListData<TEntity> = {
      items,
      skip,
      take,
      totalItems
    };

    return result;
  }

  async getById(id: TPrimaryKey) {
    const repository = this.manager.getRepository(this.type);
    const result = await repository.findOne(id);

    return result;
  }
}
