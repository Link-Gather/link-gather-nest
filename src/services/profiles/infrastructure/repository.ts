import { Injectable } from '@nestjs/common';
import { Repository } from '../../../libs/ddd';
import { Profile } from '../domain/model';

@Injectable()
export class ProfileRepository extends Repository<Profile, Profile['id']> {
  entityClass = Profile;
}
