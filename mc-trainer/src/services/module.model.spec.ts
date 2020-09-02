import { Module } from './module.model';

describe('Module', () => {
  it('should create an instance', () => {
    expect(new Module('1', 'abc', 'module',  ['abc', 'd'])).toBeTruthy();
  });
});
