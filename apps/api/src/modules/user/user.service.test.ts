import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUserDeletionCleanupPlan } from './user.service';

test('buildUserDeletionCleanupPlan includes the main user-owned tables', () => {
  const plan = buildUserDeletionCleanupPlan('user_123');

  const models = plan.map((step) => step.model);

  assert.ok(models.includes('passwordReset'));
  assert.ok(models.includes('session'));
  assert.ok(models.includes('supportMessage'));
  assert.ok(models.includes('review'));
  assert.ok(models.includes('user'));
  assert.equal(plan.find((step) => step.model === 'user')?.where.id, 'user_123');
});
