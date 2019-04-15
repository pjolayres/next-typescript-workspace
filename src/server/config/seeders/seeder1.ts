import { EntityManager } from 'typeorm';

import DatabaseMetadata from '../../entities/database-metadata';
import logger from '../../shared/logger';
import EventItem from '../../entities/event-item';

const seeder1 = async (entityManager: EntityManager, databaseMetadata: DatabaseMetadata) => {
  if (databaseMetadata.Version >= 1) {
    return databaseMetadata;
  }

  logger.info('Seeding database [1].');

  const event = new EventItem();
  event.StartDate = new Date();
  event.Title = 'Test Event';
  event.Summary = 'Test Summary';
  event.Body = 'Test Body';
  event.Address = 'Test Address';
  event.Latitude = 25.0924;
  event.Longitude = 55.1490923;

  await entityManager.save(event);

  databaseMetadata.Version = 1;

  return databaseMetadata;
};

export default seeder1;
