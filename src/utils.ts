export function keyValuePairs(valid: string[], obj: any) {
  const keys = Object.keys(obj).filter((key) => valid.includes(key));
  const values = keys.map((key) => obj[key]);
  const indices = keys.map((_, i) => `$${i + 1}`);
  const keyIndices = keys.map((key, i) => `${key} = $${i + 1}`);
  return { keys, values, indices, keyIndices };
}

export function validKeys(valid: string[], obj: any) {
  return Object.keys(obj).filter((key) => valid.includes(key));
}

export function keyValues(keys: string[], obj: any) {
  return keys.map((key) => obj[key]);
}