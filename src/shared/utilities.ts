import { FetchListOptions, SearchableEntityProperties } from '../../types';

const Utilities = {
  cleanSplit: (text: string | null | undefined, delimiter: string, trim: boolean = true) => {
    if (!text) {
      return new Array<string>();
    }

    const result = text
      .split(delimiter)
      .map(token => (trim ? token.trim() : token))
      .filter(token => !!token);

    return result;
  },
  parseFetchListOptions: <TEntity>(query: any) => {
    const options: FetchListOptions<TEntity> = {};

    const skip = parseInt(query.skip, 10);
    if (!isNaN(skip)) {
      options.skip = skip;
    }

    const take = parseInt(query.take, 10);
    if (!isNaN(take)) {
      options.take = take;
    }

    const sortAscendingList = Utilities.cleanSplit(query.sortAscending as string, ',') as Array<keyof TEntity>;
    const sortDescendingList = Utilities.cleanSplit(query.sortDescending as string, ',') as Array<keyof TEntity>;

    if (sortAscendingList.length > 0 || sortDescendingList.length > 0) {
      const order: { [P in keyof TEntity]?: 'ASC' | 'DESC' | 1 | -1 } = {};

      sortAscendingList.forEach(key => {
        order[key] = 'ASC';
      });
      sortDescendingList.forEach(key => {
        order[key] = 'DESC';
      });

      options.order = order;
    }

    const searchText = ((query.searchText as string) || '').trim();
    if (searchText) {
      options.searchText = searchText;
    }

    const searchFields = Utilities.cleanSplit(query.searchFields as string, ',') as Array<keyof SearchableEntityProperties<TEntity>>;
    if (searchFields.length > 0) {
      options.searchFields = searchFields;
    }

    return options;
  }
};

export default Utilities;
