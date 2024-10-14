import {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Form } from "react-bootstrap";
import * as XLSX from "xlsx";
import { Sheet, WorkSheet } from "xlsx";

import { CheckboxGroup, IOption } from "../../components/CheckboxGroup";
import { CustomTable } from "../../components/CustomTable";
import {
  BATTALIONS_TO_TRACK,
  HOSPITALIZATION_DAYS_TO_TRACK,
  HospitalizedColumns,
  REPORT_SHEET_NAME,
} from "../../constants/hospitalized";
import { Patient } from "../../entities/patient";
import ReportService from "../../services/ReportService";
import { convertFromExcelDate } from "../../utils/xlsx";

import "./index.css";

export const Hospitalized = () => {
  const [sheet, setSheet] = useState<Sheet>();
  const [range, setRange] = useState<XLSX.Range>();

  const [hospitalizedColumns, setHospitalizedColumns] = useState<Patient[]>([]);
  const [hospitalized, setHospitalized] = useState<Patient[]>([]);

  const [outpatient, setOutpatients] = useState<Patient[]>([]);
  const [outpatientColumns, setOutpatientsColumns] = useState<Patient[]>([]);

  const [daysAgo, setDaysAgo] = useState<number>(HOSPITALIZATION_DAYS_TO_TRACK);

  const [battalions, setBattalions] = useState<IOption[]>([]);

  const patientsToDisplay = useMemo(
    () =>
      ReportService.filterPatientsToTrack(
        hospitalized,
        battalions.filter(({ checked }) => checked).map(({ id }) => id),
        daysAgo
      ).map((patient) => ({
        ...patient,
        [HospitalizedColumns.HOSPITALIZED_DATE]: convertFromExcelDate(
          Number(patient[HospitalizedColumns.HOSPITALIZED_DATE])
        ),
      })),
    [battalions, daysAgo, hospitalized]
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
        const newBattalions = ReportService.getBattalions(sheet).map<IOption>(
          (bat) => ({
            label: bat,
            id: bat,
            checked: BATTALIONS_TO_TRACK.includes(bat),
          })
        );

        setBattalions(newBattalions);
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

      setHospitalizedColumns(Object.values(columnNames));
      setHospitalized(patients);
    };

    fetchPatients();
  }, [range, sheet]);

  useEffect(() => {
    const fetchOutpatients = () => {
      if (!range || !sheet) {
        return;
      }

      const [columnNames, ...patients] =
        ReportService.getOutpatientsTable(sheet);

      setOutpatientsColumns(Object.values(columnNames));
      setOutpatients(patients);
    };

    fetchOutpatients();
  }, [range, sheet]);

  return (
    <div>
      <h3>Госпіталізовані</h3>

      <Form.Group controlId="formFile" className="mb-3">
        <Form.Control
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </Form.Group>

      {battalions.length > 0 && (
        <div className="Panel">
          <div>
            <Form.Label>Більше ніж {daysAgo} днів тому</Form.Label>

            <Form.Range
              value={daysAgo}
              min={0}
              max={120}
              onChange={handleDaysAgoChange}
            />
          </div>

          <CheckboxGroup
            canCheckAll
            items={battalions}
            onChange={setBattalions}
          />
        </div>
      )}

      <CustomTable
        title="Госпіталізовані"
        columns={hospitalizedColumns}
        items={patientsToDisplay}
      />

      <CustomTable
        title="Амбулаторні"
        columns={outpatientColumns}
        items={outpatient}
      />
    </div>
  );
};
