const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { JwtAuthGuard } = require('../dist/common/guards/jwt-auth.guard');

const contextFor = (authorization) => ({
  switchToHttp: () => ({ getRequest: () => ({ headers: { authorization } }) }),
});

test('rejects requests without a bearer token', () => {
  process.env.JWT_ACCESS_SECRET = 'test-secret';
  assert.throws(() => new JwtAuthGuard().canActivate(contextFor(undefined)), /Authentication required/);
});

test('accepts a valid access token and attaches its claims', () => {
  process.env.JWT_ACCESS_SECRET = 'test-secret';
  const token = jwt.sign({ sub: 'user-1', email: 'user@example.com', role: 'USER' }, 'test-secret');
  const request = { headers: { authorization: `Bearer ${token}` } };
  const context = { switchToHttp: () => ({ getRequest: () => request }) };

  assert.equal(new JwtAuthGuard().canActivate(context), true);
  assert.equal(request.user.sub, 'user-1');
});

test('rejects tokens signed with another secret', () => {
  process.env.JWT_ACCESS_SECRET = 'test-secret';
  const token = jwt.sign({ sub: 'user-1' }, 'wrong-secret');
  assert.throws(
    () => new JwtAuthGuard().canActivate(contextFor(`Bearer ${token}`)),
    /Invalid or expired token/,
  );
});