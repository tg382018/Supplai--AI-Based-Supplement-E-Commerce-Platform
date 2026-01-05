import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>('mail.user');
    const pass = this.configService.get<string>('mail.pass');

    const config: any = {
      host: this.configService.get<string>('mail.host') || 'smtp.ethereal.email',
      port: this.configService.get<number>('mail.port') || 587,
      secure: this.configService.get<boolean>('mail.secure') || false,
    };

    if (user && pass) {
      config.auth = { user, pass };
    }

    this.transporter = nodemailer.createTransport(config);
  }

  async sendVerificationEmail(email: string, code: string) {
    // Dev note: Always log the code to console so development is not blocked by mail issues
    this.logger.log(`==========================================`);
    this.logger.log(`VERIFICATION CODE FOR ${email}: ${code}`);
    this.logger.log(`==========================================`);

    const mailOptions = {
      from: this.configService.get<string>('mail.from') || '"Supplai Support" <support@supplai.com>',
      to: email,
      subject: 'Supplai Kayıt Doğrulama Kodunuz',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4a90e2; text-align: center;">Supplai'ye Hoş Geldiniz!</h2>
          <p>Kayıt işlemini tamamlamak için lütfen aşağıdaki doğrulama kodunu kullanın:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p>Bu kod 15 dakika süreyle geçerlidir. Eğer bu kayıt işlemini siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">
            Supplai Team © 2026
          </p>
        </div>
      `,
    };

    try {
      if (this.configService.get('mail.user')) {
        await this.transporter.sendMail(mailOptions);
        this.logger.log(`Verification email sent to ${email}`);
      } else {
        this.logger.warn(`Email not sent: SMTP credentials (MAIL_USER/MAIL_PASS) are missing in .env`);
      }
    } catch (error: any) {
      this.logger.error(`Failed to send email to ${email}: ${error.message}`);
    }
  }
}
