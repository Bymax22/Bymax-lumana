import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private userService: UserService) {}

  private safeUser(user: any) {
    const { password, ...data } = user;
    return data;
  }

  async register(data: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new BadRequestException('Email is already registered.');
    }

    const user = await this.userService.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role
    });

    return this.safeUser(user);
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const refreshToken = randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt
      }
    });

    return {
      user: this.safeUser(user),
      refreshToken,
      expiresAt
    };
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
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
