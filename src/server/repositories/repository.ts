import { EntityManager, getManager, ObjectType, FindManyOptions, FindConditions, FindOperator, ObjectID } from 'typeorm';

import { ListData, FetchListOptions, PaginatedFetchListOptions } from '../../../types';
import Utilities from '../../shared/utilities';
import { NotImplementedError, ValidationError, ValidationErrorCodes, MiscellaneousErrorCodes } from '../../shared/errors';
import transactionScope from '../shared/transaction-scope';

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

  getPrimaryKey(item: TEntity) {
    const repository = this.manager.getRepository(this.type);
    const result = repository.getId(item);

    return result;
  }

  async getItems(options?: FetchListOptions<TEntity>) {
    const queryOptions: FindManyOptions<TEntity> = {};

    if (options && options.order) {
      queryOptions.order = options.order;
    }

    let filters: Array<FindConditions<TEntity>> = [];

    if (options && options.searchFields) {
      const searchTokens = Utilities.cleanSplit(options.searchText, ' ');

      if (searchTokens.length > 0) {
        options.searchFields.forEach(key => {
          searchTokens.forEach(searchToken => {
            const filter: FindConditions<TEntity> = {};

            filter[key] = new FindOperator<FindConditions<string>>('like', `%${searchToken}%` as string) as any;

            filters.push(filter);
          });
        });
      }
    }

    if (options && options.filters) {
      filters = [...filters, ...options.filters];
    }

    if (filters.length > 0) {
      queryOptions.where = filters;
    }

    const repository = this.manager.getRepository(this.type);
    const result = await repository.find(queryOptions);

    return result;
  }

  async getPaginatedItems(options?: PaginatedFetchListOptions<TEntity>) {
    const skip = Math.max(options && typeof options.skip !== 'undefined' ? options.skip : 0, 0);
    const take = Math.min(options && typeof options.take !== 'undefined' ? options.take : 20, 100);

    const queryOptions: FindManyOptions<TEntity> = {
      skip,
      take
    };

    if (options && options.order) {
      queryOptions.order = options.order;
    }

    let filters: Array<FindConditions<TEntity>> = [];

    if (options && options.searchFields) {
      const searchTokens = Utilities.cleanSplit(options.searchText, ' ');

      if (searchTokens.length > 0) {
        options.searchFields.forEach(key => {
          searchTokens.forEach(searchToken => {
            const filter: FindConditions<TEntity> = {};

            filter[key] = new FindOperator<FindConditions<string>>('like', `%${searchToken}%` as string) as any;

            filters.push(filter);
          });
        });
      }
    }

    if (options && options.filters) {
      filters = [...filters, ...options.filters];
    }

    if (filters.length > 0) {
      queryOptions.where = filters;
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

  async getItemsByIds(ids: TPrimaryKey[]) {
    const repository = this.manager.getRepository(this.type);
    const results = await repository.findByIds(ids);

    return results;
  }

  async getItemViews(_options?: FetchListOptions<TEntity>) {
    // TODO: Implemented when views are available

    throw new NotImplementedError('Not yet implemented.');
  }

  async getById(id: TPrimaryKey) {
    const repository = this.manager.getRepository(this.type);
    const result = await repository.findOne(id);

    return result;
  }

  async getViewById(_id: TPrimaryKey) {
    // TODO: Implemented when views are available

    throw new NotImplementedError('Not yet implemented.');
  }

  async getViewsByIds(_ids: TPrimaryKey[]) {
    // TODO: Implemented when views are available

    throw new NotImplementedError('Not yet implemented.');
  }

  async add(item: TEntity) {
    const repository = this.manager.getRepository(this.type);
    if (repository.hasId(item)) {
      throw new ValidationError('', ValidationErrorCodes.InsertExistingItemError);
    }

    const result = await repository.save(item);

    return result;
  }

  async update(item: TEntity) {
    const repository = this.manager.getRepository(this.type);
    const id = repository.getId(item);

    const typeMetadata = this.manager.connection.getMetadata(this.type);
    const primaryColumn = typeMetadata.columns.find(column => column.isPrimary);
    const versionColumn = typeMetadata.columns.find(column => column.isVersion);

    if (!primaryColumn) {
      throw new Error('The entity does not have any primary columns.');
    }

    const filter = {
      [primaryColumn.propertyName]: id
    };

    const entityWithTimestamp = item as any;
    if (versionColumn) {
      filter[versionColumn.propertyName] = entityWithTimestamp[versionColumn.propertyName];
    }

    let result: TEntity | undefined;
    await transactionScope(async transactionManager => {
      const transactionRepository = transactionManager.getRepository(this.type);

      const existingItem = await transactionRepository.findOne(id as TPrimaryKey);
      if (!existingItem) {
        throw new NotImplementedError('Item does not exist.', ValidationErrorCodes.RecordDoesNotExist);
      }
      if (versionColumn && (existingItem as any)[versionColumn.propertyName] !== (item as any)[versionColumn.propertyName]) {
        throw new ValidationError('Cannot update outdated record', MiscellaneousErrorCodes.UpdateOutdatedRecord);
      }

      await repository.update(filter as any, item);

      result = await this.getById(id);
    }, this.manager);

    return result;
  }

  async delete(item: TEntity) {
    const repository = this.manager.getRepository(this.type);
    const id = repository.getId(item);

    // TODO: Throw NotFoundError if the record does not exist.

    const result = await repository.delete(id);

    return result;
  }

  async deleteById(id: TPrimaryKey) {
    const repository = this.manager.getRepository(this.type);

    // TODO: Add optimistic concurrency check
    // TODO: Throw NotFoundError if the record does not exist.

    const result = await repository.delete(id);

    return result;
  }
}
