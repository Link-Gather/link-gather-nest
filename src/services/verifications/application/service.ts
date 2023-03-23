import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { badRequest } from '../../../libs/exception';
import { Transactional } from '../../../libs/orm/transactional';
import { UserRepository } from '../../users/infrastructure/repository';
import { Verification } from '../domain/model';
import { VerificationRepository } from '../infrastructure/repository';

@Injectable()
export class VerificationService {
  constructor(
    private userRepository: UserRepository,
    private verificationRepository: VerificationRepository,
    private mailerService: MailerService,
  ) {}

  @Transactional()
  async verifyEmail(email: string) {
    const [user] = await this.userRepository.find({ email });
    if (user) {
      throw badRequest(`Invalid email(${email}) is entered. Please check the email.`, {
        errorMessage: `중복된 이메일입니다. 다시 입력해주세요.`,
      });
    }
    const verification = new Verification({ email });
    await this.verificationRepository.save([verification]);
    await this.send({ email: verification.email, code: verification.code });
  }

  async confirm({ code, email }: { code: string; email: string }) {
    const [verification] = await this.verificationRepository.find(
      { email },
      { limit: 1, lock: { mode: 'pessimistic_write' } },
      { order: { id: 'DESC' } },
    );

    verification.verify(code);
    await this.verificationRepository.save([verification]);
  }

  private async send(args: { email: string; code: string }) {
    await this.mailerService.sendMail({
      to: args.email,
      from: 'noreply@linkgather.co.kr',
      subject: '[링크게더] 이메일 인증 코드입니다.',
      text: '이메일 인증 코드입니다. 해당 코드를 입력해주세요!',
      html: `
        <div style="max-width:600px; margin:auto">
          <div style="margin:auto; display:flex; flex-direction:column; gap:32px;">
            <p style="font-size:26px; font-weight: bold;">
              이메일 인증을 진행해주세요
            </p>
            <div>
              <p>
                안녕하세요. 링크게더를 이용해주셔서 감사합니다 :)
              </p>
              <p>
                링크게더 가입을 위해 아래 인증번호를 화면에 입력해주세요.
              </p>
            </div>
            <div style="height:5rem;background-color:#E3E3FF;text-align:center;">
              <span style="font-size: 3rem; font-weight: bold; letter-spacing: 8px;">
                ${args.code}
              </span>
            </div>
            <span>
              본 인증번호의 유효기간은 24시간 입니다.
            </span>
          </div>
        </div>  
      `,
    });
  }
}
