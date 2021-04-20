import { NeedsAuthMiddleware } from './needs-auth.middleware';

describe('NeedsAuthMiddleware', () => {
  it('should be defined', () => {
    expect(new NeedsAuthMiddleware()).toBeDefined();
  });
});
