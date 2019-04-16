import { Connection, EntityManager } from 'typeorm';

import databaseInitializer from '../config/database-initializer';
import EventItem from '../entities/event-item';
import EventRegistration from '../entities/event-registration';

import Repository from './repository';

beforeAll(() => {
  jest.setTimeout(30 * 1000); // 30-second timeout
});

describe('Repository', () => {
  let connection!: Connection;
  let entityManager!: EntityManager;

  beforeEach(async () => {
    connection = await databaseInitializer();
    entityManager = connection.createEntityManager();
  });

  afterEach(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  test('Database entities are initially empty when test is run.', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);
    const eventRegistrationsRepository = new Repository<EventRegistration, string>(EventRegistration, entityManager);

    const eventItems = await eventItemsRepository.getItems();

    expect(eventItems.totalItems).toBe(0);
    expect(eventItems.items.length).toBe(0);

    const eventRegistration = await eventRegistrationsRepository.getItems();

    expect(eventRegistration.totalItems).toBe(0);
    expect(eventRegistration.items.length).toBe(0);
  });

  test('In-memory database is cleared after each test', async () => {
    const eventItemsRepository = new Repository<EventItem, string>(EventItem, entityManager);

    const eventItems = await eventItemsRepository.getItems();

    expect(eventItems.totalItems).toBe(0);
    expect(eventItems.items.length).toBe(0);
  });
});
