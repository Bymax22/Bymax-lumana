import { publicApi } from './publicApi';

export interface AuthRegisterData {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

export interface AuthLoginData {
  email: string;
  password: string;
}

export interface AuthForgotPasswordData {
  email: string;
}

export interface AuthResetPasswordData {
  token: string;
  password: string;
}

export interface AuthVerifyEmailData {
  email: string;
  token: string;
}

export interface AuthVerifyLoginOtpData {
  email: string;
  token: string;
}

export async function authRegister(data: AuthRegisterData) {
  return publicApi('/auth/register', { method: 'POST', body: JSON.stringify(data) }, 30000);
}

export async function authLogin(data: AuthLoginData) {
  return publicApi('/auth/login', { method: 'POST', body: JSON.stringify(data) }, 30000);
}

export async function authForgotPassword(data: AuthForgotPasswordData) {
  return publicApi('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) });
}

export async function authResetPassword(data: AuthResetPasswordData) {
  return publicApi('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) });
}

export async function authVerifyEmail(data: AuthVerifyEmailData) {
  return publicApi('/auth/verify-email', { method: 'POST', body: JSON.stringify(data) });
}

export async function authVerifyLoginOtp(data: AuthVerifyLoginOtpData) {
  return publicApi('/auth/verify-login-otp', { method: 'POST', body: JSON.stringify(data) });
}
