import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Form, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import * as XLSX from "xlsx";
import { Sheet, WorkSheet } from "xlsx";

import {
  BATTALIONS_TO_TRACK,
  HospitalizedColumns,
  HOSPITALIZATION_DAYS_TO_TRACK,
  REPORT_SHEET_NAME,
} from "../constants/hospitalized";
import { Patient } from "../entities/patient";
import ReportService from "../services/ReportService";
import { convertFromExcelDate } from "../utils/xlsx";

export const Hospitalized = () => {
  const [sheet, setSheet] = useState<Sheet>();
  const [range, setRange] = useState<XLSX.Range>();

  const [columns, setColumns] = useState<Patient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const [daysAgo, setDaysAgo] = useState<number>(HOSPITALIZATION_DAYS_TO_TRACK);
  const [battalions, setBattalions] = useState<string[]>([]);

  const [selectedBattalions, setSelectedBattalions] =
    useState<string[]>(BATTALIONS_TO_TRACK);

  const patientsToDisplay = useMemo(
    () =>
      ReportService.filterPatientsToTrack(
        patients,
        selectedBattalions,
        daysAgo
      ).map((pat) => ({
        ...pat,
        [HospitalizedColumns.HOSPITALIZED_DATE]: convertFromExcelDate(
          Number(pat[HospitalizedColumns.HOSPITALIZED_DATE])
        ),
      })),
    [daysAgo, patients, selectedBattalions]
  );

  const handleSelectedBattalionsChange = useCallback(
    (battalions: string[]) => setSelectedBattalions(battalions),
    []
  );

  const handleDaysAgoChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) =>
      setDaysAgo(Number(target.value)),
    []
  );

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

  useEffect(() => {
    const fetchBattalions = () => {
      if (sheet) {
        setBattalions(ReportService.getBattalions(sheet));
      }
    };

    fetchBattalions();
  }, [sheet]);

  useEffect(() => {
    const fetchPatients = () => {
      if (!range || !sheet) {
        return;
      }

      const [columnNames, ...patients] =
        ReportService.getHospitalizedPatientsTable(sheet);

      setColumns(Object.values(columnNames));
      setPatients(patients);
    };

    fetchPatients();
  }, [range, sheet]);

  return (
    <div>
      <h3>Госпіталізовані</h3>

      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      <>
        <Form.Label value={1}>Більше ніж {daysAgo} днів тому</Form.Label>

        <Form.Range
          value={daysAgo}
          min={0}
          max={60}
          onChange={handleDaysAgoChange}
        />
      </>

      <ToggleButtonGroup
        type="checkbox"
        value={selectedBattalions}
        onChange={handleSelectedBattalionsChange}
      >
        {battalions.map((battalion) => (
          <ToggleButton key={battalion} id={battalion} value={battalion}>
            {battalion}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {patientsToDisplay && (
        <Table striped bordered hover variant="light">
          {columns && (
            <thead>
              <tr>
                {columns.map((data, index) => (
                  <th key={index}>{data?.toString()}</th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {patientsToDisplay.map((patient, index) => (
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
