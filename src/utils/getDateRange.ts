import { format, startOfYear, endOfToday, subDays } from "date-fns";
import { type DateRangePicker } from "~/components/Dashboard/SearchMenu/RangePicker";
import { DATE_FORMAT_TOKEN } from "~/constants";
import { type SearchType } from "~/types";

interface DateRange {
  gte: string | undefined;
  lte: string;
}

function getDateRange(search: SearchType): DateRange {
  const today = endOfToday();

  let gte: Date | undefined;
  let lte: Date = today;

  switch (search) {
    case "allData":
      lte = today; // epoch start
      gte = undefined; // undefined lte for allDays
      break;
    case "startOfYear":
      gte = startOfYear(today);
      break;
    case "today":
      gte = today;
      break;
    default:
      if (typeof Number(search) === "number" && !isNaN(search)) {
        gte = subDays(today, search);
      } else {
        throw new Error("Invalid search type");
      }
      break;
  }

  return {
    gte: gte ? format(gte, DATE_FORMAT_TOKEN) : undefined,
    lte: format(lte, DATE_FORMAT_TOKEN),
  };
}

const getCustomDateRange = (customDate: DateRangePicker | undefined) => {
  if (!customDate) return { gte: "", lte: "" };
  return {
    gte: format(customDate.from, DATE_FORMAT_TOKEN),
    lte: format(customDate.to, DATE_FORMAT_TOKEN),
  };
};

export { getDateRange, getCustomDateRange };
