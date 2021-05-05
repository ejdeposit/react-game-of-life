import {mod} from './myModule';

test('adds 1 + 2 to equal 3', () => {
    expect(1+2).toBe(3);
  });
  
  test('3 mod 2 to equal 1', () => {
    expect(mod(3,2)).toBe(1);
  });