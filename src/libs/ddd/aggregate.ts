import { isEqual } from 'lodash';
import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { stripUndefined } from '../common';

export abstract class Aggregate {
  // eslint-disable-next-line @typescript-eslint/ban-types
  protected getClasses(): Function[] {
    return [this.constructor];
  }

  @CreateDateColumn()
  private createdAt!: Date;

  @Column()
  private createdBy!: string;

  @UpdateDateColumn()
  private updatedAt!: Date;

  @Column()
  private updatedBy!: string;

  setTxId(txId: string) {
    if (!this.createdBy) {
      this.createdBy = txId;
    }
    this.updatedBy = txId;
  }

  /**
   * @param changed 변경된 obj
   * @returns Aggregate의 changed를 비교해서 변경된 부분만 반환한다. 바뀐게 없다면 undefined 를 반환한다.
   */
  protected stripUnchanged(changed: { [key: string]: any }) {
    const compared = Object.keys(changed).reduce((acc: { [key: string]: any }, prop) => {
      const originValue = this[prop as keyof typeof this];
      const changedValue = changed[prop];
      acc[prop] = !isEqual(originValue, changedValue) ? changedValue : undefined;
      return acc;
    }, {});

    return stripUndefined(compared);
  }
}
