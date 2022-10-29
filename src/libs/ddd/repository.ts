import { EntityManager, In, ObjectType } from 'typeorm';

export abstract class Repository<T, ID> {
  protected abstract entityClass: ObjectType<T>;

  constructor(protected entityManager: EntityManager) {}

  public async save(entities: T[]) {
    return this.entityManager.save(entities, { reload: true });
  }

  public async findByIds(ids: ID[]) {
    const primaryColumns = this.entityManager.connection
      .getMetadata(this.entityClass)
      .columns.filter((column) => column.isPrimary);
    if (primaryColumns.length !== 1) {
      throw new Error(
        `Not supported: there should be only one primary column on aggregate root, but ${primaryColumns.length} columns are found.`,
      );
    }

    const primaryColumnPropertyName = primaryColumns[0].propertyName;
    return this.entityManager.findBy(this.entityClass, {
      [primaryColumnPropertyName]: In(ids),
    });
  }

  public async delete(ids: ID[]) {
    await this.entityManager.delete(this.entityClass, ids);
  }
}
