import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateUserDto } from '../dto/create-user-dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  constructor(args: CreateUserDto) {
    if (args) {
      this.email = args.email;
      this.password = args.password;
    }
  }
}
