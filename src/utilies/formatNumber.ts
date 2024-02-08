export function formatNumberWithoutRounding(number: number, decimals: number): number {
    const multiplier: number = Math.pow(10, decimals);
    const roundedValue: number = Math.floor(number * multiplier) / multiplier;
    return roundedValue;
  }
  