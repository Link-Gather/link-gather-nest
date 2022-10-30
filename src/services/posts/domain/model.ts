import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreatePostDto } from '../dto/create-post-dto';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  constructor(args: CreatePostDto) {
    if (args) {
      this.title = args.title;
      this.description = args.description;
    }
  }
}
