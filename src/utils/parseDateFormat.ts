import { format, parse } from "date-fns";

export const parseDateFormat = (
  inputDateString: string,
  outputToken = "dd/MM/yyyy",
) => {
  const parsedDate = parse(inputDateString, "yyyyMMdd", new Date());
  if (isNaN(parsedDate.getTime())) return "-";
  const formattedDate = format(parsedDate, outputToken);
  return formattedDate;
};
