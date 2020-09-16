import { User } from './user.model';

describe('User', () => {
  it('should create an instance', () => {
    expect(new User('0', 'test@test.com', '1234')).toBeTruthy();
  });
});
