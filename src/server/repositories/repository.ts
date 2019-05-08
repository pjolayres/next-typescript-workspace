import { EntityManager, getManager, ObjectType, FindManyOptions, FindConditions, FindOperator, ObjectID, DeepPartial } from 'typeorm';
import { validate } from 'class-validator';

import { ListData, FetchListOptions, PaginatedFetchListOptions } from '../../types';
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

  // Entity methods

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

  async getById(id: TPrimaryKey) {
    const repository = this.manager.getRepository(this.type);
    const result = await repository.findOne(id);

    return result;
  }

  async add(item: TEntity | DeepPartial<TEntity>) {
    const repository = this.manager.getRepository(this.type);
    const entity: TEntity = repository.create(item);

    const errors = await validate(entity, { skipMissingProperties: true, validationError: { target: false } });
    if (errors.length > 0) {
      throw new ValidationError('', ValidationErrorCodes.ValidationError, errors);
    }

    if (repository.hasId(entity)) {
      throw new ValidationError('', ValidationErrorCodes.InsertExistingItemError);
    }

    const result = await repository.save(entity);

    return result;
  }

  async update(item: TEntity | DeepPartial<TEntity>) {
    const repository = this.manager.getRepository(this.type);
    const entity: TEntity = repository.create(item);
    const id = repository.getId(entity);

    const errors = await validate(entity, { validationError: { target: false } });
    if (errors.length > 0) {
      throw new ValidationError('', ValidationErrorCodes.ValidationError, errors);
    }

    const typeMetadata = this.manager.connection.getMetadata(this.type);
    const primaryColumn = typeMetadata.columns.find(column => column.isPrimary);
    const versionColumn = typeMetadata.columns.find(column => column.isVersion);
    const dateCreatedColumn = typeMetadata.columns.find(column => column.isCreateDate);
    const dateModifiedColumn = typeMetadata.columns.find(column => column.isUpdateDate);

    if (dateCreatedColumn && dateCreatedColumn.propertyName) {
      delete (entity as any)[dateCreatedColumn.propertyName];
    }
    if (dateModifiedColumn && dateModifiedColumn.propertyName) {
      delete (entity as any)[dateModifiedColumn.propertyName];
    }

    if (!primaryColumn) {
      throw new Error('The entity does not have any primary columns.');
    }

    const filter = {
      [primaryColumn.propertyName]: id
    };

    const entityWithTimestamp = entity as any;
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
      if (versionColumn && (existingItem as any)[versionColumn.propertyName] !== (entity as any)[versionColumn.propertyName]) {
        throw new ValidationError('Cannot update outdated record', MiscellaneousErrorCodes.UpdateOutdatedRecord);
      }

      await repository.update(filter as any, entity);

      result = await this.getById(id);
    }, this.manager);

    return result as TEntity;
  }

  async delete(item: TEntity) {
    const repository = this.manager.getRepository(this.type);
    const entity: TEntity = repository.create(item);
    const id = repository.getId(entity);

    const result = await this.deleteById(id);

    return result;
  }

  async deleteById(id: TPrimaryKey) {
    const repository = this.manager.getRepository(this.type);

    const existingItem = await repository.findOne(id);
    if (!existingItem) {
      throw new ValidationError('The record does not exist', ValidationErrorCodes.RecordDoesNotExist);
    }

    const result = await repository.delete(id);

    return result;
  }

  // View methods

  async getItemViews(_options?: FetchListOptions<TEntity>) {
    // TODO: Implemented when views are available

    throw new NotImplementedError('Not yet implemented.');
  }

  async getViewById(_id: TPrimaryKey) {
    // TODO: Implemented when views are available

    throw new NotImplementedError('Not yet implemented.');
  }

  async getViewsByIds(_ids: TPrimaryKey[]) {
    // TODO: Implemented when views are available

    throw new NotImplementedError('Not yet implemented.');
  }
}
