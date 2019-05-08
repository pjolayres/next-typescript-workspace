import { FindOperator } from 'typeorm';

import EventRegistration from '../entities/event-registration';
import { FetchListOptions } from '../../types';

import Repository from './repository';

export default class EventRegistrationsRepository extends Repository<EventRegistration, string> {
  constructor() {
    super(EventRegistration);
  }

  async getFilteredItems(eventItemIds?: string[], options?: FetchListOptions<EventRegistration>) {
    const effectiveOptions = options || {};
    effectiveOptions.filters = effectiveOptions.filters || [];

    if (eventItemIds) {
      effectiveOptions.filters.push({
        EventItemId: new FindOperator('in', eventItemIds as any, true, true)
      });
    }

    return super.getItems(effectiveOptions);
  }
}
