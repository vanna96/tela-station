import ExcelJS from "exceljs";
import { Sheet, SheetBody, SheetCell, SheetHeader } from "./type";
//

export const excelSheetTitle = (
  worksheet: ExcelJS.Worksheet,
  name: string
): ExcelJS.Worksheet => {
  worksheet.getCell("B2").value = "KAMPUCHEA TELA";
  worksheet.getCell("B2").font = {
    size: 13,
    bold: true,
  };
  worksheet.getCell("B3").value = name;
  worksheet.getCell("B3").font = {
    size: 11,
    // bold: true,
  };
  worksheet.getCell("B4").value = "Date:";
  worksheet.getCell("B4").font = {
    size: 11,
    // bold: true,
  };
  worksheet.getCell("C4").value = new Date(Date.now()).toLocaleDateString(
    "en-GB",
    {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }
  );
  worksheet.getCell("C4").font = {
    size: 11,
    // bold: true,
  };

  return worksheet;
};

export const excelSheetHeader = (
  headers: SheetHeader,
  worksheet: ExcelJS.Worksheet
): ExcelJS.Worksheet => {
  if (headers.value.length === 0) throw new Error("Header could not be empty");

  const columns = [{ value: "No", width: 7 }, ...headers.value] as SheetCell[];
  //
  for (let index = 0; index < columns.length; index++) {
    // set up starter row or column
    const startCol = headers.startCol ? headers.startCol + index : index + 1;
    const startRow = headers.startRow ?? 6;

    const colLetter = String.fromCharCode(65 + startCol);
    const cell = colLetter + startRow; // example C6

    // set width
    worksheet.getColumn(colLetter).width = columns[index].width ?? 20;
    // worksheet.getRow(startCol).height = 20;

    worksheet.getCell(cell).value = columns[index].value;
    worksheet.getCell(cell).numFmt = '"   "@';
    //
    worksheet.getCell(cell).font = {
      // bold: true,
      color: { argb: "ffffff" },
      ...headers.style?.font,
    };
    // Fill Cell
    worksheet.getCell(cell).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "16A34A" }, // Header background color
      ...headers.style?.fill,
    };

    worksheet.getCell(cell).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
      ...headers.style?.border,
    };
  }

  return worksheet;
};

export const excelSheetBody = (
  body: SheetBody,
  worksheet: ExcelJS.Worksheet
): ExcelJS.Worksheet => {
  //
  if (body.value.length === 0) return worksheet;

  // Add data starting from Row 2 with borders
  const startingRowIndex = body?.startRow ? body.startRow + 1 : 7; // example : B7
  const startingColIndex = body?.startCol ? body?.startCol + 1 : 2; // example : B

  body.value.forEach((rowData, rowIndex) => {
    const rowNumber = rowIndex + startingRowIndex;
    // set row index
    const row = worksheet.getRow(rowNumber);

    row.getCell(startingColIndex).value = rowIndex + 1;
    row.getCell(startingColIndex).alignment = {
      vertical: "middle", // Vertical alignment
      horizontal: "center", // Horizontal alignment
    };
    row.getCell(startingColIndex).border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    //
    rowData.forEach((cellValue, colIndex) => {
      const colLetter = colIndex + (startingColIndex + 1);
      // Add cell data
      row.getCell(colLetter).value = cellValue; // Adjust for starting at Column A
      // Set border for the cell
      row.getCell(colLetter).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
        ...body.style?.border,
      };
      row.getCell(colLetter).alignment = body.style?.alignment ?? {};
      row.getCell(colLetter).font = body.style?.font ?? {};
      // row.getCell(colLetter).fill = { pattern: "solid" };
      // body[rowIndex].style?.cellFill;
    });
    // console.log("--------");
  });

  return worksheet;
};

export const exportDefaulExcelTemplate = async (sheet: Sheet) => {
  const {
    header,
    enableHeaderFilter = true,
    sheetName,
    aditional,
    body,
    title,
  } = sheet;

  // Create a new Excel workbook
  const workbook = new ExcelJS.Workbook();
  let worksheet = workbook.addWorksheet(sheetName ?? "Sheet", {
    autoFilter: enableHeaderFilter && {
      from: {
        row: header?.startRow ?? 6,
        column: header.startCol ? header.startCol + 2 : 3,
      },
      to: {
        row: header?.startRow ?? 6,
        column: header.value.length + 2, // Adjust the column index based on the number of columns
      },
    },
  });

  // Manually set values for the cells in the second row
  excelSheetTitle(worksheet, title ?? "");
  if (aditional) {
    worksheet = aditional;
  }

  //
  await excelSheetHeader(header, worksheet);
  await excelSheetBody(
    { ...body, startCol: header.startCol, startRow: header.startRow },
    worksheet
  );

  const buffer = await workbook.xlsx.writeBuffer();

  // Create a Blob from the buffer
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Create a download link and trigger the download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${sheet.filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
