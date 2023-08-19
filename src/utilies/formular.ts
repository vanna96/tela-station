import { currencyFormat } from './index';
export default class Formular {
  constructor() { }

  public static findItemTotal(items: any[]): number {
    const total = items?.reduce((accumulator: number, currentItem: any) => {
      return accumulator + (currentItem.quantity * currentItem.unitPrice);
    }, 0);
    if (isNaN(total)) return 0;

    return total;
  }



  public static findTotalBeforeDiscount(items: any[]): number {
    const total = items?.reduce((prev: number, currentItem: any) => prev + currentItem?.LineTotal, 0);

    if (isNaN(total)) return 0;

    return parseFloat(total);
  }


  public static findLineTotal(qty: string, price: string, discount: string) {
    const total = parseFloat(price ?? 0) * parseFloat(qty ?? 0) - (parseFloat(price ?? 0) * parseFloat(qty ?? 0) * (parseFloat(discount ?? 0) / 100))
    if (isNaN(total)) {
      return 0;
    }

    return total;
  }
  // public static TotalDiscountPercent = totalVal * (discountPercent / 100);


  public static findToTal(qty: string, price: string) {
    const total = parseFloat(price) * parseFloat(qty);

    if (isNaN(total)) return 0;

    return total;
  }

  public static findToTalDiscountPercent(
    qty: string,
    price: string,
    discount: number
  ) {
    let total = (parseFloat(price ?? "0") *
      parseFloat(qty ?? "0") -
      parseFloat(price ?? "0") *
      parseFloat(qty ?? "0") *
      discount / 100)


    if (isNaN(total)) return 0;

    return total;
  }

  public static calculateTotalTax(items: any[], totalDiscount = 0): number {
    let totalTax = this.findTotalBeforeDiscount(items) - totalDiscount;
    const taxRates = items.reduce((prev, cur) => prev + (cur?.vatRate ?? 0), 0);

    totalTax = totalTax - (totalTax - ((totalTax * taxRates) / 100));

    if (isNaN(totalTax)) {
      return 0;
    }

    return totalTax;
  }



  // will be update for performance
  public static calculateTotalPaymentDue(items: any[], totalDiscount = 0): number {
    const total = this.calculateTotalTax(items) + this.findTotalBeforeDiscount(items);

    if (isNaN(total)) return 0;

    return total - totalDiscount;
  }


}