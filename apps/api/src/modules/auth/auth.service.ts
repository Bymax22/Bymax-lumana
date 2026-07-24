import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { sendBrevoMail } from './email.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private userService: UserService) {}

  private safeUser(user: any) {
    const { password, ...data } = user;
    return data;
  }

  private normalizeEmail(email?: string) {
    if (typeof email !== 'string') {
      return undefined;
    }

    return email.trim().toLowerCase();
  }

  private async createChallenge(userId: string, token: string, expiresAt: Date) {
    return this.prisma.passwordReset.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  private async consumeChallenge(token: string) {
    return this.prisma.passwordReset.updateMany({
      where: { token, used: false, expiresAt: { gt: new Date() } },
      data: { used: true },
    });
  }

  private async sendVerificationEmail(email: string, name: string | undefined, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'https://www.lumanainvestment.com'}/auth/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    return sendBrevoMail({
      to: email,
      name,
      subject: 'Verify your Lumana account',
      html: `<p>Hello ${name || 'there'},</p><p>Thanks for signing up with Lumana AutoPlanet. Please verify your email by clicking the link below:</p><p><a href="${verificationUrl}">Verify my account</a></p><p>If you did not create this account, you can ignore this message.</p>`,
    });
  }

  private async sendLoginOtp(email: string, name: string | undefined, code: string) {
    return sendBrevoMail({
      to: email,
      name,
      subject: 'Your Lumana login verification code',
      html: `<p>Hello ${name || 'there'},</p><p>Your one-time login verification code is <strong>${code}</strong>.</p><p>Use it to complete your sign-in to Lumana AutoPlanet.</p>`,
    });
  }

  async register(data: RegisterDto) {
    const email = this.normalizeEmail(data?.email);
    const password = typeof data?.password === 'string' ? data.password : undefined;

    if (!email || !password) {
      throw new BadRequestException('Email and password are required.');
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email is already registered.');
    }

    const user = await this.userService.create({
      name: data?.name?.trim(),
      email,
      password,
      role: data?.role,
    });

    const verificationToken = `verify_${randomBytes(20).toString('hex')}`;
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await this.createChallenge(user.id, verificationToken, verificationExpiresAt);
    await this.sendVerificationEmail(email, user.name || undefined, verificationToken);

    return {
      message: 'Account created successfully. Please verify your email before continuing.',
      requiresVerification: true,
      user: this.safeUser(user),
    };
  }

  async login(data: LoginDto) {
    const email = this.normalizeEmail(data?.email);
    if (!email) {
      throw new BadRequestException('A valid email is required.');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const otpCode = `${Math.floor(100000 + Math.random() * 900000)}`;
    const otpToken = `otp_${otpCode}`;
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.createChallenge(user.id, otpToken, otpExpiresAt);
    await this.sendLoginOtp(email, user.name || undefined, otpCode);

    return {
      message: 'A verification code has been sent to your email.',
      requiresOtp: true,
      user: this.safeUser(user),
    };
  }

  async verifyEmail(email: string, token: string) {
    const normalizedEmail = this.normalizeEmail(email);
    if (!normalizedEmail || !token) {
      throw new BadRequestException('A valid email and token are required.');
    }

    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      throw new NotFoundException('No account found with that email.');
    }

    const challenge = await this.prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        token,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!challenge) {
      throw new BadRequestException('The verification link is invalid or has expired.');
    }

    await this.prisma.passwordReset.update({
      where: { id: challenge.id },
      data: { used: true },
    });

    return { message: 'Email verified successfully. You can now sign in.' };
  }

  async verifyLoginOtp(email: string, token: string) {
    const normalizedEmail = this.normalizeEmail(email);
    if (!normalizedEmail || !token) {
      throw new BadRequestException('A valid email and verification code are required.');
    }

    const user = await this.prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      throw new NotFoundException('No account found with that email.');
    }

    const challenge = await this.prisma.passwordReset.findFirst({
      where: {
        userId: user.id,
        token: `otp_${token}`,
        used: false,
        expiresAt: { gt: new Date() },
      },
    });

    if (!challenge) {
      throw new BadRequestException('The verification code is invalid or has expired.');
    }

    await this.prisma.passwordReset.update({
      where: { id: challenge.id },
      data: { used: true },
    });

    const refreshToken = randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt,
      },
    });

    return {
      user: this.safeUser(user),
      refreshToken,
      expiresAt,
    };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const email = this.normalizeEmail(data?.email);
    if (!email) {
      throw new BadRequestException('A valid email is required.');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('No account found with that email.');
    }

    const token = randomBytes(20).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt
      }
    });

    return {
      message: 'Password reset token generated. Use the token to reset your password.',
      resetToken: token
    };
  }

  async resetPassword(data: ResetPasswordDto) {
    const resetRequest = await this.prisma.passwordReset.findFirst({
      where: {
        token: data.token,
        used: false,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    });

    if (!resetRequest) {
      throw new BadRequestException('Invalid or expired reset token.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.prisma.user.update({
      where: { id: resetRequest.userId },
      data: { password: hashedPassword }
    });

    await this.prisma.passwordReset.update({
      where: { id: resetRequest.id },
      data: { used: true }
    });

    return {
      message: 'Your password has been reset successfully. You can now login with the new password.'
    };
  }
}
