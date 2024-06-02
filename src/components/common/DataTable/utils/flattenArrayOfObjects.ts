import { parseAndUpperString } from "./common";

/**
 * Flattens each object in an array, so that all nested properties are on the root level,
 * with their keys indicating the path.
 *
 * @param {any[]} array - The array of objects to be flattened.
 * @param {string} [separator='.'] - The separator used between nested keys.
 * @returns {Record<string, any>[]} - An array of flattened objects.
 */
const flattenArrayOfObjects = (array: any[], separator: string = "."): Record<string, any>[] => {
  return array.map((item) => flattenObject(item, "", separator));
};

/**
 * Recursively flattens a nested object and serializes array leafs to a string.
 *
 * @param {Record<string, any>} obj - The object to be flattened.
 * @param {string} [parentKey=''] - The initial key to be prefixed for nested properties.
 * @param {string} [separator='.'] - The separator used between nested keys.
 * @returns {Record<string, any>} - The flattened object with serialized array leafs.
 */
function flattenObject(obj: Record<string, any>, parentKey: string = "", separator: string = "."): Record<string, any> {
  const flatObject: Record<string, any> = {};

  Object.keys(obj).forEach((key) => {
    const newKey = parentKey ? parseAndUpperString(`${parentKey}${separator}${key}`) : parseAndUpperString(key);
    const value = obj[key];

    // Check if the value is an array. If yes, convert it to a string.
    if (Array.isArray(value)) {
      flatObject[newKey] = JSON.stringify(value);
    } else if (value && typeof value === "object") {
      // Recurse for nested objects.
      Object.assign(flatObject, flattenObject(value, newKey, separator));
    } else {
      // Assign all other values directly.
      flatObject[newKey] = value;
    }
  });

  return flatObject;
}

export { flattenArrayOfObjects, flattenObject };
