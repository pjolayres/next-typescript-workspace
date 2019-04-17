import { EntityManager } from 'typeorm';

const transactionScope = async (callback: (transactionManager: EntityManager) => Promise<void>, manager: EntityManager) => {
  if (!manager) {
    throw new Error('Cannot start transaction scope without entity manager.');
  }

  if (manager.queryRunner && manager.queryRunner.isTransactionActive) {
    await callback(manager);
  }
  else {
    await manager.transaction(async trxManager => {
      await callback(trxManager);
    });
  }
};

export default transactionScope;
