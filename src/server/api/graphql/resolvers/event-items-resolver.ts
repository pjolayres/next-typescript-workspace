import { Query, Args, Resolver, FieldResolver, Root, Ctx, Mutation, Arg } from 'type-graphql';

import EventItem from '../../../entities/event-item';
import FetchListArgs from '../types/fetch-list-args';
import EventItemInput from '../types/event-item-input';
import Utilities from '../../../../shared/utilities';
import EventRegistration from '../../../entities/event-registration';
import { Context } from '../../../../types';
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

  @Mutation(_returns => EventItem)
  async addEventItem(@Arg('eventItem') eventItemInput: EventItemInput): Promise<EventItem> {
    const eventItemsRepository = new EventItemsRepository();
    const result = await eventItemsRepository.add(eventItemInput);

    return result;
  }

  @Mutation(_returns => EventItem)
  async updateEventItem(@Arg('eventItem') eventItemInput: EventItemInput): Promise<EventItem> {
    const eventItemsRepository = new EventItemsRepository();
    const result = await eventItemsRepository.update(eventItemInput);

    return result;
  }

  @Mutation(_returns => Boolean)
  async deleteEventItem(@Arg('id') id: string): Promise<boolean> {
    const eventItemsRepository = new EventItemsRepository();
    await eventItemsRepository.deleteById(id);

    return true;
  }
}
