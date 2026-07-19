import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {}

  /** Mismas variables SMTP_* que usaba el provider nodemailer de Strapi. */
  private getTransporter(): nodemailer.Transporter | null {
    const user = this.config.get<string>("SMTP_USER");
    const pass = this.config.get<string>("SMTP_PASS");
    if (!user || !pass) return null;
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: this.config.get("SMTP_HOST", "smtp.gmail.com"),
        port: Number(this.config.get("SMTP_PORT", 587)),
        secure: this.config.get("SMTP_SECURE") === "true",
        auth: { user, pass },
      });
    }
    return this.transporter;
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.warn(
        `SMTP no configurado (SMTP_USER/SMTP_PASS): email a ${to} no enviado`,
      );
      return;
    }
    await transporter.sendMail({
      from: this.config.get("EMAIL_FROM", "no-reply@irisnatural.com"),
      to,
      subject,
      html,
    });
  }
}
