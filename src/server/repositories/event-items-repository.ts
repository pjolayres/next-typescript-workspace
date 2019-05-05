import EventItem from '../entities/event-item';

import Repository from './repository';

export default class EventItemsRepository extends Repository<EventItem, string> {
  constructor() {
    super(EventItem);
  }
}
