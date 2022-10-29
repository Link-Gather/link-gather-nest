import { Inject } from '@nestjs/common';
import {
  EntityManager,
  FindManyOptions,
  In,
  ObjectLiteral,
  ObjectType,
} from 'typeorm';
import {
  convertOptions,
  DuplicateEntityError,
  DuplicateEntryError,
  FindOrder,
  Specification,
} from '../orm';

export abstract class Repository<T extends ObjectLiteral, ID> {
  protected abstract entityClass: ObjectType<T>;

  @Inject('entityManager') private entityManager!: EntityManager;

  protected getManager(): EntityManager {
    return this.entityManager;
  }

  public async save(entities: T[]) {
    await this.saveEntities(entities);
  }

  /**
   * @param entities
   */
  private async saveEntities(entities: T[]) {
    return this.entityManager.save(entities, { reload: true }).catch((err) => {
      if (err instanceof DuplicateEntryError) {
        throw new DuplicateEntityError();
      }
      throw err;
    });
  }

  /**
   * softDelete
   * @param entity
   */
  public async remove(entity: T) {
    this.entityManager.softRemove(entity);
  }

  /**
   *
   * @param ids
   */
  public async delete(ids: ID[]) {
    await this.entityManager.delete(this.entityClass, ids);
  }

  /**
   * @param spec
   * @param options
   * @param order
   */
  public async findAll(
    spec: Specification<T>,
    options?: FindManyOptions,
    order?: FindOrder,
  ): Promise<T[]> {
    return this.getManager().find<T>(this.entityClass, {
      where: spec.where,
      ...convertOptions(options),
      ...order,
    } as FindManyOptions<T>);
  }

  public async countAll(spec: Specification<T>): Promise<number> {
    return this.getManager().count<T>(
      this.entityClass,
      spec.where as FindManyOptions<T>,
    );
  }

  /**
   *
   * @param ids
   */
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
    // @ts-expect-error
    return this.entityManager.findBy(this.entityClass, {
      [primaryColumnPropertyName]: In(ids),
    });
  }
}
