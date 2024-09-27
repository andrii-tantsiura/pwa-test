import * as XLSX from "xlsx";
import { Sheet } from "xlsx";

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
