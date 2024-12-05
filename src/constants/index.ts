export const DATE_FORMAT_TOKEN = "yyyyMMdd";
export const DATE_FORMAT_TOKEN_PICKER = "dd/MM/yyyy";
export const iconHeight = 18;

export const ADMINS = ["admin@institut.rs"];

export const limitOptions = ["100", "200", "500", "1000"] as const;
export type LimitOption = (typeof limitOptions)[number];
