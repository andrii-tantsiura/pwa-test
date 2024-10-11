import * as XLSX from "xlsx";
import { Sheet } from "xlsx";

import { HospitalizedColumns } from "../constants/hospitalized";
import { Patient } from "../entities/patient";
import { isEventEarlierThan } from "../utils/date";
import {
  convertFromExcelDate,
  findValueAddressInRow,
  readRangeFromStrAsArray as readArrayFromSheet,
  readTableFromSheet,
} from "../utils/xlsx";

class ReportService {
  public getBattalions(sheet: Sheet) {
    return readArrayFromSheet(sheet, "B8:B17");
  }

  public getHospitalizedPatientsTable(sheet: Sheet): any[] {
    return readTableFromSheet(sheet, "A22", "N22");
  }

  public getOutpatientsTable(sheet: Sheet): any[] {
    const tableName = "Амбулаторні";

    const foundAddress = findValueAddressInRow(
      tableName,
      XLSX.utils.decode_cell("C22"),
      sheet
    );

    if (!foundAddress) {
      throw new Error(`Таблицю ${tableName} не знайдено`);
    }

    const recordsAddress = XLSX.utils.encode_cell({
      r: foundAddress.r + 1,
      c: foundAddress.c - 2,
    });

    return readTableFromSheet(sheet, recordsAddress, "N22");
  }

  public filterPatientsToTrack(
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
