import { Query, Args, Resolver } from 'type-graphql';

import EventRegistrationsRepository from '../../../repositories/event-registrations-repository';
import EventRegistration from '../../../entities/event-registration';
import FetchListArgs from '../types/fetch-list-args';
import Utilities from '../../../../shared/utilities';

@Resolver(_of => EventRegistration)
export default class EventRegistrationsResolver {
  eventRegistrationsRepository = new EventRegistrationsRepository();

  @Query(_returns => [EventRegistration])
  async eventRegistrations(@Args() args: FetchListArgs) {
    const options = Utilities.parsePaginatedFetchListOptions<EventRegistration>(args);

    const items = await this.eventRegistrationsRepository.getItems(options);

    return items;
  }
}
