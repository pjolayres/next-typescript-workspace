import { EntityManager, getManager, ObjectType, FindManyOptions, FindConditions, FindOperator, ObjectID } from 'typeorm';

import { ListData, FetchListOptions } from '../../../types';
import Utilities from '../../shared/utilities';

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

    if (options && options.searchFields) {
      const searchTokens = Utilities.cleanSplit(options.searchText, ' ');

      if (searchTokens.length > 0) {
        const filters: Array<FindConditions<TEntity>> = [];

        options.searchFields.forEach(key => {
          searchTokens.forEach(searchToken => {
            const filter: FindConditions<TEntity> = {};

            filter[key] = new FindOperator<FindConditions<string>>('like', `%${searchToken}%` as string) as any;

            filters.push(filter);
          });
        });

        queryOptions.where = filters;
      }
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
