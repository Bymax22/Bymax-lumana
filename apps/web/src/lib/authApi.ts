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

export async function authRegister(data: AuthRegisterData) {
  return publicApi('/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

export async function authLogin(data: AuthLoginData) {
  return publicApi('/auth/login', { method: 'POST', body: JSON.stringify(data) });
}

export async function authForgotPassword(data: AuthForgotPasswordData) {
  return publicApi('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) });
}

export async function authResetPassword(data: AuthResetPasswordData) {
  return publicApi('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) });
}
