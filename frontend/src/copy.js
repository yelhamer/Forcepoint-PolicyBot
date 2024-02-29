/**
 * makes a deep copy of a value
 */
export const copy = (value) => JSON.parse(JSON.stringify(value));
