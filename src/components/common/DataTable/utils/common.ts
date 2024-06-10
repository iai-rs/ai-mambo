/**
 * Returns a Tailwind CSS class for a table row's background based on its index.
 *
 * @param index The 0-based index of the row.
 * @returns The Tailwind CSS class name for the background color.
 */
const resolveRowBackground = (index: number): string =>
  index % 2 !== 0 ? "bg-neutral-50" : "bg-neutral-50";

/**
 * Generates an array containing a sequence of numbers from 0 to the specified number (exclusive).
 *
 * @param num The number of elements in the resulting array.
 * @returns An array of sequential numbers starting from 0 up to `num - 1`.
 */
const generateSequentialNumbers = (num: number): number[] =>
  Array.from({ length: num }, (_, index) => index);

/**
 * Parses a string and converts it into an uppercase, space-separated string.
 * The function handles camelCase, lowercase, uppercase with initials, and strings separated by underscores or spaces.
 *
 * @param {string} str - The string to be parsed and converted.
 * @returns {string} The parsed string with words converted to uppercase and separated by spaces.
 */
const parseAndUpperString = (str: string) => {
  const formatted = str
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");

  const words = formatted.split(" ").map((word) => word.toUpperCase());

  return words.join(" ");
};

export { resolveRowBackground, generateSequentialNumbers, parseAndUpperString };
