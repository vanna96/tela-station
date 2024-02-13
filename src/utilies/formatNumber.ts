export function formatNumberWithoutRounding(number: number, decimals: number): number {
  const multiplier: number = Math.pow(10, decimals);
  const roundedValue: number = Math.floor(number * multiplier) / multiplier;
  return roundedValue;
}
export function commaFormatNum(numberString: any) {
  if (numberString === 0 || numberString === "0" || numberString === "0.0" || numberString === "0.00") {
    return 0;
  }

  // Ensure input is treated as a string and remove all commas
  const inputString = String(numberString).replace(/,/g, "");

  // Attempt to parse the numeric value
  const number = parseFloat(inputString);

  // Check for NaN to return a fallback or the parsed number
  return isNaN(number) ? 0 : number; // Consider how you wish to handle invalid numbers
}
