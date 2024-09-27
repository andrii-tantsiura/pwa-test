import { CellAddress, Range, Sheet, utils } from "xlsx";

import {
  BATTALIONS_TO_TRACK,
  DailyReportColumns,
  HOSPITALIZATION_DAYS_TO_TRACK,
} from "../constants/dailyReport";
import { Patient } from "../entities/patient";
import { isEventEarlierThan } from "../utils/date";
import { convertFromExcelDate, getCellValue } from "../utils/xlsx";

class ReportService {
  getHospitalizedPatients(sheet: Sheet, range: Range): Patient[] {
    const START_CELL = "A22";
    const START_TABLE_ROW = 21;
    const startCellAddress: CellAddress = utils.decode_cell(START_CELL);

    const columnLabelByAddress: { [key: string]: string } = {};

    for (let column = startCellAddress.c; column < range.e.c; column++) {
      const cellValue = getCellValue(sheet, column, START_TABLE_ROW);

      if (!cellValue) {
        break;
      }

      columnLabelByAddress[`${column},${START_TABLE_ROW}`] = cellValue;
    }

    const patients: Patient[] = [];

    let isTimeToStop = false;

    for (
      let row = startCellAddress.r;
      !isTimeToStop && row <= range.e.r;
      row++
    ) {
      const newPatient: Patient = {};

      for (let column = startCellAddress.c; column < 14; column++) {
        const cellValue = getCellValue(sheet, column, row);

        if (!cellValue && column === startCellAddress.c) {
          isTimeToStop = true;
          break;
        }

        const propName = columnLabelByAddress[`${column},${START_TABLE_ROW}`];

        newPatient[propName] =
          propName === DailyReportColumns.HOSPITALIZED_DATE
            ? convertFromExcelDate(cellValue)
            : cellValue ?? null;
      }

      patients.push(newPatient);
    }

    return patients;
  }

  filterPatientsToTrack(patients: Patient[]): Patient[] {
    const filteredPatients = patients.filter((patient: Patient) => {
      const hospitalizedDate = patient[DailyReportColumns.HOSPITALIZED_DATE];
      const battalionUnit = patient[DailyReportColumns.BATTALION_UNIT];

      return (
        BATTALIONS_TO_TRACK.includes(battalionUnit) &&
        isEventEarlierThan(hospitalizedDate, HOSPITALIZATION_DAYS_TO_TRACK)
      );
    });

    return filteredPatients;
  }
}

const reposerService = new ReportService();

export default reposerService;
