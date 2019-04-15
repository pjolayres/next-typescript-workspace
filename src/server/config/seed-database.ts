import { getManager } from 'typeorm';

import DatabaseMetadata from '../entities/database-metadata';

import seeder1 from './seeders/seeder1';

export default async () => {
  const entityManager = getManager();

  let databaseMetadata: DatabaseMetadata;

  const existingDatabaseMetadata = await entityManager.findOne(DatabaseMetadata, 1);
  if (existingDatabaseMetadata) {
    databaseMetadata = existingDatabaseMetadata;
  } else {
    databaseMetadata = new DatabaseMetadata();
    databaseMetadata.DatabaseMetadataId = 1;
    databaseMetadata.Version = 0;
  }

  const seeders = [seeder1];

  for (const seeder of seeders) {
    databaseMetadata = (await seeder(entityManager, databaseMetadata)) as DatabaseMetadata;
  }

  entityManager.save(databaseMetadata);
};
