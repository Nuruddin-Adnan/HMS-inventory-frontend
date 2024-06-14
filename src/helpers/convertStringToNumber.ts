export default function convertStringToNumber(value: string | null): number {
  if (value !== null && typeof value === "string") {
    return parseFloat(value);
  } else {
    return 0; // Default value or handle the case accordingly
  }
}
