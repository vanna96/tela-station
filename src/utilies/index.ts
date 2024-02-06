import moment from 'moment';


export const dateFormat = (str: string): string => moment(str).isValid() ? moment(str).format('DD.MMMM.YYYY') : 'N/A';


export const setItemToLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));
export const getItemFromLocal = (key: string) => JSON.parse(localStorage.getItem(key) ?? '{}');

export const currencyFormat = (value: any) => {
  if (!value) return 0.00.toFixed(2);

  if (typeof value === "number")
    return Number(Intl.NumberFormat('en-US').format(value)).toFixed(2);

  return Number(Intl.NumberFormat('en-US').format(parseFloat(value ?? 0))).toFixed(2);
}
export const currencyDetailFormat = (value: any) => {
  if (!value) return 0.00.toFixed(2);

  if (typeof value === "number")
    return "$ " + value.toFixed(2)

  return parseFloat(value).toFixed(2);
}
export const discountFormat = (value: any) => {
  if (!value) return 0;

  if (typeof value === "number")
    return value + " %"

  return parseFloat(value);
}


export const arrayBufferToBlob = async (arrayBuffer: any, type: any, fileName: string): Promise<Blob> =>
  new Promise((resolve, reject) => {

    let blob: any = new Blob([arrayBuffer], {
      type: type,
    });

    const dateNum = Date.now();
    const dateStr = new Date();
    const uuid = Date.now();

    blob['lastModified '] = dateNum
    blob['lastModifiedDate '] = dateStr;
    blob['name'] = fileName;
    blob['percent'] = 0;
    blob['uid'] = uuid;

    blob['originFileObj'] = new Blob([arrayBuffer], { type: type });
    blob['originFileObj']['lastModified'] = dateNum;
    blob['originFileObj']['lastModifiedDate'] = dateStr;
    blob['originFileObj']['name'] = fileName;
    blob['originFileObj']['uid'] = uuid;
    blob['originFileObj']['webkitRelativePath'] = '';

    resolve(blob);
  });



export const fileToBase64 = (file: any) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});


//add new util
export const fractionDigits = (value: number, digit?: number) => {
  const formater = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digit ?? 4,
    maximumFractionDigits: digit ?? 4,
  });

  return formater.format(value).replace(/,/g, "");
};

export const calculateUOM = (
  baseQty: number,
  alternativeQty: number,
  qty: number
): any => {
  let totalQty: any = fractionDigits(baseQty / alternativeQty, 6);

  totalQty = fractionDigits(qty * totalQty, 4);
  return totalQty;
};