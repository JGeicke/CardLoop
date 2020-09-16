import { Question } from './question.model';

describe('Question', () => {
  it('should create an instance', () => {
    expect(new Question('0', 'question?', ['A', 'B', 'C', 'D'], [2])).toBeTruthy();
  });
});
