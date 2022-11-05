import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Aggregate } from '../../../libs/ddd/aggregate';
import { CreatePostDto } from '../dto/create-post-dto';

@Entity()
export class Post extends Aggregate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  constructor(args: CreatePostDto) {
    super();
    if (args) {
      this.title = args.title;
      this.description = args.description;
    }
  }
}
