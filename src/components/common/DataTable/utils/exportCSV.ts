/* eslint-disable @typescript-eslint/no-unsafe-call */
import { download, generateCsv, mkConfig } from "export-to-csv";

import { flattenArrayOfObjects } from "./flattenArrayOfObjects";

const csvConfig = mkConfig({ useKeysAsHeaders: true });

/**
 * Exports an array of objects to a CSV file after flattening.
 * Nested object keys are transformed into a single level with a custom separator.
 * The function will trigger a file download with the given filename.
 *
 * @param {Record<string, any>[]} data - An array of objects with nested structure to be exported.
 * @param {string} fileName - The name of the file to be downloaded.
 */
const exportCSV = (data: Record<string, unknown>[], fileName: string): void => {
  // If there's no data, exit the function
  if (!data.length) return;

  // Flatten the array of objects
  const flattened = flattenArrayOfObjects(data, " / ");

  // Generate the CSV content from the flattened data
  const csv = generateCsv({ ...csvConfig, filename: fileName })(flattened);

  // Trigger the download of the CSV file with the generated content
  download({ ...csvConfig, filename: fileName })(csv);
};

export { exportCSV };
