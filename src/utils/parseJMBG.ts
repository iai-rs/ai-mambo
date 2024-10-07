import { differenceInYears } from "date-fns";

function parsePatientDate(dateString: string) {
  try {
    // Extract day, month, and year parts
    const day = parseInt(dateString.slice(0, 2), 10);
    const month = parseInt(dateString.slice(2, 4), 10) - 1; // month is zero-based in JavaScript
    const yearPart = parseInt(dateString.slice(4, 7), 10);
    const yearPartLastTwo = parseInt(dateString.slice(5, 7), 10);

    const year = yearPart < 100 ? 2000 + yearPartLastTwo : 1000 + yearPart;

    // Create the birthdate
    const birthdate = new Date(year, month, day);

    // Check if the date is valid
    if (isNaN(birthdate.getTime())) {
      throw new Error("Invalid date");
    }

    return birthdate;
  } catch (error) {
    return null;
  }
}

function calculateAge(birthdate: Date) {
  return differenceInYears(new Date(), birthdate);
}

function getPatientAge(dateString: string) {
  const birthdate = parsePatientDate(dateString);

  if (!birthdate) {
    return "";
  }

  return calculateAge(birthdate);
}

export { getPatientAge };
