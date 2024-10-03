import * as XLSX from "xlsx";
import { Sheet, utils, Range } from "xlsx";

const EXCEL_BASE_DATE = new Date(1900, 0, 1);

export const convertFromExcelDate = (date: number): Date =>
  new Date(EXCEL_BASE_DATE.getTime() + (date - 1) * 24 * 60 * 60 * 1000);

export const getCellValue = (
  sheet: Sheet,
  c: number,
  r: number
): any | null => {
  const cellRef = XLSX.utils.encode_cell({ c, r });

  return sheet[cellRef]?.v ?? null;
};

export const readRangeFromStrAsArray = (sheet: Sheet, rangeString: string) => {
  const range: Range = utils.decode_range(rangeString);
  const rows: string[] = [];

  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      rows.push(getCellValue(sheet, c, r));
    }
  }

  return rows;
};

export const readTableFromSheet = (
  sheet: Sheet,
  startColumn: string,
  endColumn: string
) => {
  const startCelLAddress = utils.decode_cell(startColumn);
  let endCellAddress = utils.decode_cell(endColumn);

  for (let r = startCelLAddress.r; ; r++) {
    const cellValue = getCellValue(sheet, startCelLAddress.c, r);

    if (cellValue) {
      endCellAddress = { ...endCellAddress, r };
    } else {
      break;
    }
  }

  const columnLabelByAddress = new Map<string, string>();

  for (let c = startCelLAddress.c; c < endCellAddress.c; c++) {
    columnLabelByAddress.set(
      `${c}${startCelLAddress.r}`,
      getCellValue(sheet, c, startCelLAddress.r)
    );
  }

  const entities = [];

  for (let r = startCelLAddress.r; r <= endCellAddress.r; r++) {
    const entity: { [key: string]: string } = {};

    for (let c = startCelLAddress.c; c <= endCellAddress.c; c++) {
      const propKey =
        columnLabelByAddress.get(`${c}${startCelLAddress.r}`) ?? "";

      entity[propKey] = getCellValue(sheet, c, r);
    }

    entities.push(entity);
  }

  return entities;
};
