import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { UserRepository } from '../infrastructure/repository';
import { User } from '../domain/model';
import { Transactional } from '../../../libs/orm/transactional';
import type { SignInBodyDto, SignUpBodyDto } from '../dto';
import { badRequest, unauthorized } from '../../../libs/exception';
import { hashPassword } from '../../../libs/password';
import { Profile } from '../../profiles/domain/model';
import { ProfileRepository } from '../../profiles/infrastructure/repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private profileRepository: ProfileRepository,
  ) {}

  async list({ ids }: { ids?: string[] }) {
    return this.userRepository.find({ ids });
  }

  @Transactional()
  async signUp(args: SignUpBodyDto) {
    const [newUser] = await this.userRepository.find({ email: args.email });

    if (newUser) {
      throw unauthorized(`Email(${args.email}) is already exist.`, {
        errorMessage: '이미 존재하는 이메일입니다.',
      });
    }

    // NOTE: provider === 'link-gather' 일 경우 args.password 는 required 이다.
    const password = await hashPassword(args.provider === 'link-gather' ? args.password! : nanoid(10));

    const user = new User({
      email: args.email,
      nickname: args.nickname,
      profileImage: args.profileImage,
      provider: args.provider,
      password,
    });

    const profile = new Profile({
      career: args.career,
      job: args.job,
      introduction: args.introduction,
      stacks: args.stacks,
      urls: args.urls,
      userId: user.id,
    });

    await this.userRepository.save([user]);
    await this.profileRepository.save([profile]);
  }

  async isNicknameDuplicated({ nickname }: { nickname: string }) {
    const [user] = await this.userRepository.find({ nickname });

    return !!user;
  }

  @Transactional()
  async signIn(args: SignInBodyDto) {
    const [user] = await this.userRepository.find({ email: args.email });
    if (!user) {
      throw badRequest(`이메일(${args.email})이 일치하지 않습니다.`, {
        errorMessage: '이메일이나 패스워드가 일치하지 않습니다.',
      });
    }
    await user.validatePassword(args.password);

    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        expiresIn: '1h',
      },
    );

    const refreshToken = this.jwtService.sign(
      {},
      {
        expiresIn: '30d',
      },
    );

    user.update({ refreshToken });
    await this.userRepository.save([user]);

    return { accessToken, refreshToken, user };
  }

  async retrieve({ id }: { id: string }) {
    const user = await this.userRepository.findOneOrFail(id);
    const profiles = await this.profileRepository.find({ userId: user.id });

    return {
      ...user,
      profiles,
    };
  }
}
