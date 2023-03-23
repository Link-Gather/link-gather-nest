import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { getConfig } from '../../config';
import { isProd } from '../../libs/common';
import { UserRepository } from '../users/infrastructure/repository';
import { VerificationRepository } from './infrastructure/repository';

const AUTH_PASS = getConfig('/mail/pass');

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: isProd,
        auth: {
          user: 'official.linkgather@gmail.com',
          pass: AUTH_PASS,
        },
      },
      defaults: {
        from: '"LinkGather" <noreply@linkgather.co.kr>',
      },
    }),
  ],
  controllers: [],
  providers: [UserRepository, VerificationRepository],
  exports: [UserRepository, VerificationRepository],
})
export class VerificationModule {}
