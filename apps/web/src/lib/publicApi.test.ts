import assert from 'node:assert/strict';
import test from 'node:test';
import { buildApiUrl } from './publicApi';

test('buildApiUrl uses the /api prefix by default when no base URL is configured', () => {
  assert.equal(buildApiUrl('/auth/register', '/api'), '/api/auth/register');
});

test('buildApiUrl preserves absolute API base URLs', () => {
  assert.equal(buildApiUrl('/auth/register', 'https://api.example.com'), 'https://api.example.com/auth/register');
});
