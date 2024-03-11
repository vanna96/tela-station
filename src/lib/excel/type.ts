import ExcelJS from "exceljs";
//

export type SheetCellFill = {
  fgColor?: Partial<ExcelJS.Color>;
  pattern?: Partial<ExcelJS.FillPatterns>;
};

export type SheetStyle = {
  fill?: SheetCellFill;
  cellFill?: ExcelJS.Fill;
  numFm?: string | undefined;
  font?: Partial<ExcelJS.Font>;
  border: Partial<ExcelJS.Borders>;
  alignment: Partial<ExcelJS.Alignment>;
};

export type Sheet = {
  filename: string;
  sheetName?: string;
  title?: string;
  aditional?: ExcelJS.Worksheet;
  enableHeaderFilter?: boolean;
  header: SheetHeader;
  body: SheetBody;
};

export type SheetCell = {
  value: string | number;
  width?: number;
};

export type SheetHeader = {
  style?: SheetStyle;
  value: SheetCell[];
  width?: number | undefined;
  height?: number | undefined;
  startRow?: number | undefined;
  startCol?: number | undefined;
};

export type SheetBody = {
  style?: SheetStyle;
  value: (string | number)[][];
  width?: number | undefined;
  height?: number | undefined;
  startRow?: number | undefined;
  startCol?: number | undefined;
};
