import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Aggregate } from '../../../libs/ddd/aggregate';
import { CreateUserDto } from '../dto/create-user-dto';

@Entity()
export class User extends Aggregate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  constructor(args: CreateUserDto) {
    super();
    if (args) {
      this.email = args.email;
      this.password = args.password;
    }
  }
}
