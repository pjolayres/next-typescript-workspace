import EventItem from '../server/entities/event-item';

import Utilities from './utilities';

describe('Utilities.cleanSplit()', () => {
  test('Standard usage', () => {
    const tokens = Utilities.cleanSplit('One, Two,Three ');

    expect(tokens.length).toBe(3);
    expect(tokens[0]).toBe('One');
    expect(tokens[1]).toBe('Two');
    expect(tokens[2]).toBe('Three');
  });

  test('No trim works', () => {
    const tokens = Utilities.cleanSplit('One, Two,Three ', ',', false);

    expect(tokens.length).toBe(3);
    expect(tokens[0]).toBe('One');
    expect(tokens[1]).toBe(' Two');
    expect(tokens[2]).toBe('Three ');
  });

  test('Empty string results in empty array', () => {
    const tokens = Utilities.cleanSplit('');

    expect(tokens.length).toBe(0);
  });

  test('Non-standard delimiter', () => {
    const tokens = Utilities.cleanSplit('Four||Five || Six', '||');

    expect(tokens.length).toBe(3);
    expect(tokens[0]).toBe('Four');
    expect(tokens[1]).toBe('Five');
    expect(tokens[2]).toBe('Six');
  });

  test('Text without delimiter results in single result', () => {
    const tokens = Utilities.cleanSplit('Four||Five || Six', ',');

    expect(tokens.length).toBe(1);
    expect(tokens[0]).toBe('Four||Five || Six');
  });
});

describe('Utilities.parsePaginatedFetchListOptions()', () => {
  test('Standard usage', () => {
    const query = {
      skip: '1',
      take: '20',
      sortAscending: 'Prop1, Prop2',
      sortDescending: 'Prop3,Prop4',
      searchText: 'Sample text ',
      searchFields: 'Prop3,Prop5'
    };

    const options = Utilities.parsePaginatedFetchListOptions<EventItem>(query);

    const order = options.order as any;

    expect(options).toBeDefined();
    expect(options.skip).toBe(1);
    expect(options.take).toBe(20);
    expect(order.Prop1).toBe('ASC');
    expect(order.Prop2).toBe('ASC');
    expect(order.Prop3).toBe('DESC');
    expect(order.Prop4).toBe('DESC');
    expect(options.searchText).toBe('Sample text');
    expect(options.searchFields!.length).toBe(2);
    expect(options.searchFields![0]).toBe('Prop3');
    expect(options.searchFields![1]).toBe('Prop5');
  });

  test('Missing search params', () => {
    const query = {
      skip: '1',
      take: '20',
      sortAscending: 'Prop1'
    };

    const options = Utilities.parsePaginatedFetchListOptions<EventItem>(query);

    const order = options.order as any;

    expect(options).toBeDefined();
    expect(Object.keys(options).length).toBe(3);
    expect(options.skip).toBe(1);
    expect(options.take).toBe(20);
    expect(order.Prop1).toBe('ASC');
    expect(Object.keys(order).length).toBe(1);
    expect(options.searchText).toBeUndefined();
    expect(options.searchFields).toBeUndefined();
  });
});
