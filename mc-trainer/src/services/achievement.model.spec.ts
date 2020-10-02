import { Achievement } from './achievement.model';

describe('Achievement', () => {
  it('should create an instance', () => {
    expect(new Achievement('', '','', 0 , 0 ,'')).toBeTruthy();
  });
});
