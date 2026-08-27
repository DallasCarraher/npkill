export function convertBytesToKB(bytes) {
  const factorBytestoKB = 1024;
  return bytes / factorBytestoKB;
}
export function convertBytesToGb(bytes) {
  return bytes / Math.pow(1024, 3);
}
export function convertGBToMB(gb) {
  const factorGBtoMB = 1024;
  return gb * factorGBtoMB;
}
export function convertGbToKb(gb) {
  const factorGBtoKB = 1024 * 1024;
  return gb * factorGBtoKB;
}
export function convertGbToBytes(gb) {
  return gb * Math.pow(1024, 3);
}
export function formatSize(sizeInGB, sizeUnit, decimals = 2) {
  let value;
  let unit;
  if (sizeUnit === 'gb') {
    value = sizeInGB;
    unit = 'GB';
  } else if (sizeUnit === 'mb') {
    value = convertGBToMB(sizeInGB);
    unit = 'MB';
  } else {
    // auto
    const sizeInMB = convertGBToMB(sizeInGB);
    if (sizeInMB < 1024) {
      value = sizeInMB;
      unit = 'MB';
    } else {
      value = sizeInGB;
      unit = 'GB';
    }
  }
  // For MB, round to no use decimals.
  // For GB, use specified decimals.
  let formattedValue;
  if (unit === 'MB') {
    formattedValue = Math.round(value).toString();
  } else {
    formattedValue = value.toFixed(decimals);
  }
  const text = `${formattedValue} ${unit}`;
  const bytes = convertGbToBytes(sizeInGB);
  return { value, unit, text, bytes };
}
//# sourceMappingURL=unit-conversions.js.map
