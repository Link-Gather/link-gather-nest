import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { getConfig } from '../../../config';
import { badRequest } from '../../../libs/exception';
import { Transactional } from '../../../libs/orm/transactional';
import { UserRepository } from '../../users/infrastructure/repository';
import { Verification, type VerificationType } from '../domain/model';
import { ValidVerificationSpec } from '../domain/specs/valid-verification-spec';
import { VerificationRepository } from '../infrastructure/repository';

const LINK_GATHER_FRONT_URL = getConfig('/linkgather/front/url');

@Injectable()
export class VerificationService {
  constructor(
    private userRepository: UserRepository,
    private verificationRepository: VerificationRepository,
    private mailerService: MailerService,
  ) {}

  @Transactional()
  async start({ email, type }: { email: string; type: VerificationType }) {
    const [user] = await this.userRepository.find({ email });

    if (type === 'signup' && user) {
      throw badRequest(`Invalid email(${email}) is entered. Please check the email.`, {
        errorMessage: `중복된 이메일입니다. 다시 입력해주세요.`,
      });
    }

    if (type === 'password' && !user) {
      throw badRequest(`Invalid email(${email}) is entered. Please check the email.`, {
        errorMessage: `이메일이 존재하지 않습니다. 다시 입력해주세요.`,
      });
    }

    const verification = new Verification({ email, type });
    await this.verificationRepository.save([verification]);
    await this.send(verification);
    return { id: verification.id };
  }

  async confirm({ code, id }: { code: string; id: string }) {
    const [verification] = await this.verificationRepository.findSpec(new ValidVerificationSpec({ id }));

    verification.verify(code);
    await this.verificationRepository.save([verification]);
  }

  async isValidVerification(id: string) {
    const [verification] = await this.verificationRepository.findSpec(new ValidVerificationSpec({ id }));
    if (!verification) {
      throw badRequest(`Invalid verificationId(${id}) is entered.`, {
        errorMessage: '잘못된 URL입니다. 다시한번 인증을 진행해주세요.',
      });
    }
  }

  @Transactional()
  async changePassword({ id, password, passwordConfirm }: { id: string; password: string; passwordConfirm: string }) {
    const [verification] = await this.verificationRepository.findSpec(new ValidVerificationSpec({ id }));
    const [user] = await this.userRepository.find({ email: verification.email });

    await user.changePassword({ password, passwordConfirm });
    verification.verify();

    await Promise.all([this.userRepository.save([user]), this.verificationRepository.save([verification])]);
  }

  private async send(verification: Verification) {
    if (verification.type === 'signup') {
      await this.mailerService.sendMail({
        to: verification.email,
        from: 'noreply@linkgather.co.kr',
        subject: '[링크게더] 이메일 인증 코드입니다.',
        text: '이메일 인증 코드입니다. 해당 코드를 입력해주세요!',
        html: `
          <div style="max-width:600px; margin:auto">
            <div style="margin:auto; display:flex; flex-direction:column; gap:32px;">
            <img style="aspect-ratio:auto 763 / 329; width:150px;" src="https://link-gather-img.s3.ap-northeast-2.amazonaws.com/Link+gather_logo-01+1.png" />
              <p style="font-size:26px; font-weight: bold;">
                이메일 인증을 진행해주세요
              </p>
              <div>
                <p>
                  링크게더를 이용해주셔서 감사합니다 :)
                </p>
                <p>
                  가입을 위해 아래 인증번호를 화면에 입력해주세요.
                </p>
              </div>
              <div style="height:5rem;background-color:#E3E3FF;text-align:center; vertical-align:middle;">
                <span style="font-size: 3rem; font-weight: bold; letter-spacing: 8px;">
                  ${verification.code}
                </span>
              </div>
              <span>
                본 인증번호의 유효기간은 3분 입니다.
              </span>
            </div>
          </div>  
        `,
      });
    }
    if (verification.type === 'password') {
      await this.mailerService.sendMail({
        to: verification.email,
        from: 'noreply@linkgather.co.kr',
        subject: '[링크게더] 비밀번호 찾기 링크입니다.',
        text: '비밀번호 찾기 링크입니다. 아래링크에 들어가서 비밀번호 재설정을 해주세요!',
        html: `
          <div style="max-width:600px; margin:auto">
            <div style="margin:auto; display:flex; flex-direction:column; gap:32px;">
              <img style="aspect-ratio:auto 763 / 329; width:150px;" src="https://link-gather-img.s3.ap-northeast-2.amazonaws.com/Link+gather_logo-01+1.png" />
              <p style="font-size:26px; font-weight: bold;">
                이메일 인증을 진행해주세요
              </p>
              <div>
                <p>
                  링크게더를 이용해주셔서 감사합니다 :)
                </p>
                <p>
                  비밀번호 재설정을 위해 아래 링크로 접속하여 비밀번호를 재설정 해주세요.
                </p>
              </div>
              <div style="height:5rem;background-color:#E3E3FF;text-align:center; padding: 20px;">
                <a style="font-size: 3rem; font-weight: bold; letter-spacing: 8px; text-decoration:none; color:#5555ff;" 
                  href="${LINK_GATHER_FRONT_URL}/forgot-password?step=password&verificationId=${verification.id}"
                >
                  비밀번호 재설정
                </a>
              </div>
              <span>
                본 인증번호의 유효기간은 1시간 입니다.
              </span>
            </div>
          </div>  
        `,
      });
    }
  }
}
