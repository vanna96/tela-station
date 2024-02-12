export function formatNumberWithoutRounding(number: number, decimals: number): number {
  const multiplier: number = Math.pow(10, decimals);
  const roundedValue: number = Math.floor(number * multiplier) / multiplier;
  return roundedValue;
}
export function commaFormatNum(numberString: any) {
  // Check if the input is 0 or a string representing 0
  if (numberString === 0 || numberString === "0" || numberString === "0.0" || numberString === "0.00") {
    return 0;
  }

  // Remove the comma from the string
  var stringWithoutComma = numberString?.replace(",", "");

  // Convert the string to a float
  var number = parseFloat(stringWithoutComma);

  return number;
}

