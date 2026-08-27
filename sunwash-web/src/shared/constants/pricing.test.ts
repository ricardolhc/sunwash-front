import { calculateServicePrice } from './pricing';

describe('calculateServicePrice', () => {
  it('applies the minimum of four panels when the informed quantity is below the minimum', () => {
    expect(calculateServicePrice(2)).toBe(180);
  });

  it('adds the base fee to the price of every panel above the minimum', () => {
    expect(calculateServicePrice(10)).toBe(270);
  });
});
