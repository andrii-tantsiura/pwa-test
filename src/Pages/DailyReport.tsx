import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import * as XLSX from "xlsx";
import { Sheet, WorkSheet } from "xlsx";

import { REPORT_SHEET_NAME } from "../constants/dailyReport";
import { Patient } from "../entities/patient";
import ReportService from "../services/ReportService";

export const DailyReport = () => {
  const [sheet, setSheet] = useState<Sheet>();
  const [range, setRange] = useState<XLSX.Range>();
  const [patients, setPatients] = useState<Patient[]>();
  const [patientsToDisplay, setPatientsToDisplay] = useState<Patient[]>();

  const handleLoadReport = useCallback(
    ({ target }: ProgressEvent<FileReader>) => {
      const binaryString = target?.result as string;
      const workbook = XLSX.read(binaryString, { type: "binary" });

      const sheetName = workbook.SheetNames.find(
        (name) => name === REPORT_SHEET_NAME
      );

      if (!sheetName) {
        alert(`Sheet named "${REPORT_SHEET_NAME}" does not exist`);
        return;
      }

      const sheet: WorkSheet = workbook.Sheets[sheetName];
      setSheet(sheet);

      const sheetRef = sheet["!ref"];

      if (sheetRef) {
        setRange(XLSX.utils.decode_range(sheetRef));
      }
    },
    []
  );

  const handleFileUpload: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      const file = event.target.files?.[0];

      if (file) {
        const reader = new FileReader();

        reader.onload = handleLoadReport;
        reader.readAsArrayBuffer(file);
      }
    },
    [handleLoadReport]
  );

  const fetchPatients = useCallback(() => {
    if (!range || !sheet) {
      return;
    }

    const patients = ReportService.getHospitalizedPatients(sheet, range);

    setPatients(patients);
  }, [range, sheet]);

  const filterPatientsToTrack = useCallback(() => {
    if (patients) {
      const filtered = ReportService.filterPatientsToTrack(patients);

      setPatientsToDisplay(filtered);
    }
  }, [patients]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    filterPatientsToTrack();
  }, [filterPatientsToTrack]);

  return (
    <div>
      <h3>Daily Report</h3>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {patientsToDisplay && (
        <Table striped bordered hover variant="light">
          <thead>
            <tr>
              {Object.keys(patientsToDisplay[0]).map((data, index) => (
                <th key={index}>{data?.toString()}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {patientsToDisplay?.map((patient, index) => (
              <tr key={index}>
                {Object.values(patient).map((data, index) => (
                  <td key={index}>{data?.toString()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};
