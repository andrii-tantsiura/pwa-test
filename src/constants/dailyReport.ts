export enum DailyReportColumns {
  LAST_NAME_FIRST_NAME_PATRONYMIC = "Прізвище, ім'я, По-батькові(повністю)",
  RANK_POSITION = "Посада/Військове звання",
  BATTALION_UNIT = "Батальйон/Підрозділ",
  COMPANY = "Рота",
  PLATOON = "Взвод",
  HOSPITALIZED_MEDICAL_FACILITY = "Госпіталізовані в мед. заклад",
  DIAGNOSIS = "Діагноз",
  HOSPITALIZED_DATE = "Дата госпіталізації",
  HOSPITAL = "Госпіталь",
  CODE_615 = "Код 6.15",
  PLANNED_DISCHARGE_DATE = "Планова дата виписки",
  COMMENT = "Коментарій",
  DATE_OF_BIRTH = "Дата народження",
}

export const REPORT_SHEET_NAME = "рапорт";

export const BATTALIONS_TO_TRACK = [
  "Управління",
  "Рота забезпечення",
  "Медичний пункт",
  "Взвод звязку",
];

export const HOSPITALIZATION_DAYS_TO_TRACK = 21;
