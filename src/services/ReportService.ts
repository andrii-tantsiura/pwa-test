import { Sheet } from "xlsx";

import { HospitalizedColumns } from "../constants/hospitalized";
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
      const patientBattalion = patient[HospitalizedColumns.BATTALION_UNIT];
      const hospitalizedDate = patient[HospitalizedColumns.HOSPITALIZED_DATE];

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
