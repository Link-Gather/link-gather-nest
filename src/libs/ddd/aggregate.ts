import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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
}
