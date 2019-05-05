import { Query, Args, Resolver, FieldResolver, Root, Ctx } from 'type-graphql';

import EventItem from '../../../entities/event-item';
import FetchListArgs from '../types/fetch-list-args';
import Utilities from '../../../../shared/utilities';
import EventRegistration from '../../../entities/event-registration';
import { Context } from '../../../../../types';
import EventItemsRepository from '../../../repositories/event-items-repository';
import EventRegistrationsRepository from '../../../repositories/event-registrations-repository';

@Resolver(_of => EventItem)
export default class EventItemsResolver {
  @Query(_returns => [EventItem])
  async eventItems(@Args() args: FetchListArgs) {
    const options = Utilities.parsePaginatedFetchListOptions<EventItem>(args);

    const items = await new EventItemsRepository().getItems(options);

    return items;
  }

  @FieldResolver()
  async EventRegistrations(@Root() eventItem: EventItem, @Ctx() context: Context) {
    const dataLoader = context.dataLoaderFactory.getDataSetLoader<EventRegistration, string>(EventRegistration, 'EventItemId', async (eventItemIds: string[]) => {
      const eventRegistrationsRepository = new EventRegistrationsRepository();
      const items = await eventRegistrationsRepository.getFilteredItems(eventItemIds);
      const sortedItems = eventItemIds.map(key => items.filter(item => key === item.EventItemId));

      return sortedItems;
    });

    const result = await dataLoader.load(eventItem.EventItemId);

    return result;
  }
}
