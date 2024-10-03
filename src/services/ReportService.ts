import { Sheet } from "xlsx";

import { DailyReportColumns } from "../constants/dailyReport";
import { Patient } from "../entities/patient";
import {
  convertFromExcelDate,
  readRangeFromStrAsArray as readArrayFromSheet,
  readTableFromSheet,
} from "../utils/xlsx";
import { isEventEarlierThan } from "../utils/date";

class ReportService {
  getBattalions(sheet: Sheet) {
    return readArrayFromSheet(sheet, "B8:B17");
  }

  getHospitalizedPatientsTable(sheet: Sheet): any[] {
    return readTableFromSheet(sheet, "A22", "N22");
  }

  filterPatientsToTrack(
    patients: Patient[],
    battalions: string[],
    daysAgo: number
  ): Patient[] {
    return patients.filter((patient) => {
      const patientBattalion = patient[DailyReportColumns.BATTALION_UNIT];
      const hospitalizedDate = patient[DailyReportColumns.HOSPITALIZED_DATE];

      return (
        (!battalions.length || battalions.includes(patientBattalion)) &&
        isEventEarlierThan(
          convertFromExcelDate(Number(hospitalizedDate)),
          daysAgo
        )
      );
    });
  }
}

const reposerService = new ReportService();

export default reposerService;
